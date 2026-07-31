import { useEffect, useMemo, useState } from "react";
import { loadExercises, type Exercise } from "./content";
import { SqliteWorkerClient } from "./engine";
import { evaluateResults, type EvaluationVerdict } from "./evaluation";
import { loadProgress, resetProgress, saveProgress } from "./storage/progress";
import type { EngineOutcome, QueryResult, SchemaOutcome } from "./types/query";

const DATABASE_URL = "/db/hospital_v0_1.sqlite";
type Runtime = { execute(url: string, sql: string): Promise<EngineOutcome>; introspectSchema(url: string): Promise<SchemaOutcome>; dispose(): void };
export type AppProps = { loadContent?: () => Promise<Exercise[]>; createRuntime?: () => Runtime; storage?: Storage };

const loadDefaultContent = () => loadExercises();
const createDefaultRuntime = () => new SqliteWorkerClient();

export function App({ loadContent = loadDefaultContent, createRuntime = createDefaultRuntime, storage = window.localStorage }: AppProps) {
  const runtime = useMemo(createRuntime, [createRuntime]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [schema, setSchema] = useState<SchemaOutcome>();
  const [result, setResult] = useState<QueryResult>();
  const [feedback, setFeedback] = useState<EvaluationVerdict | { status: "error"; message: string }>();
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    void Promise.all([loadContent(), runtime.introspectSchema(DATABASE_URL)]).then(([items, schemaOutcome]) => {
      if (!mounted) return;
      setExercises(items);
      setDrafts(Object.fromEntries(items.map((item) => [item.id, item.starterSql])));
      setCompleted(new Set(loadProgress(storage, items.map((item) => item.id)).completedExerciseIds));
      setSchema(schemaOutcome);
    }).catch((error: unknown) => mounted && setLoadError(error instanceof Error ? error.message : "Unable to load the trainer."));
    return () => { mounted = false; runtime.dispose(); };
  }, [loadContent, runtime, storage]);

  const exercise = exercises[activeIndex];
  async function execute(check: boolean) {
    if (!exercise) return;
    setBusy(true);
    setFeedback(undefined);
    try {
      const learner = await runtime.execute(DATABASE_URL, drafts[exercise.id] ?? "");
      if (!learner.ok) {
        setResult(undefined);
        setFeedback({ status: "error", message: learner.error.message });
        return;
      }
      setResult(learner.result);
      if (check) {
        const reference = await runtime.execute(DATABASE_URL, exercise.referenceSql);
        if (!reference.ok) setFeedback({ status: "error", message: reference.error.message });
        else {
          const verdict = evaluateResults(learner.result, reference.result, exercise.evaluation);
          setFeedback(verdict);
          if (verdict.status === "pass") setCompleted((current) => {
            const next = new Set(current).add(exercise.id); saveProgress(storage, next); return next;
          });
        }
      }
    } catch (error: unknown) {
      setResult(undefined);
      setFeedback({ status: "error", message: error instanceof Error ? error.message : "Unable to execute the query." });
    } finally {
      setBusy(false);
    }
  }

  function select(index: number) { setActiveIndex(index); setResult(undefined); setFeedback(undefined); }
  function clearProgress() {
    if (window.confirm("Reset all completed exercise progress?")) { resetProgress(storage); setCompleted(new Set()); }
  }

  if (loadError) return <main className="loading"><h1>SQL Static Trainer</h1><p role="alert">{loadError}</p></main>;
  if (!exercise) return <main className="loading"><h1>SQL Static Trainer</h1><p>Loading exercises and database…</p></main>;

  return <div className="app">
    <header><div><span className="dialect">SQLite</span><h1>SQL Static Trainer</h1><p>Learn by querying a focused hospital dataset.</p></div><button className="quiet" onClick={clearProgress}>Reset progress</button></header>
    <aside className="sidebar" aria-label="Exercises"><p className="eyebrow">Exercises · {completed.size}/{exercises.length}</p><nav>{exercises.map((item, index) =>
      <button key={item.id} className={index === activeIndex ? "exercise active" : "exercise"} onClick={() => select(index)} aria-current={index === activeIndex ? "page" : undefined}>
        <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong>{completed.has(item.id) && <b aria-label="Completed">✓</b>}
      </button>)}</nav></aside>
    <main className="workspace">
      <section className="challenge"><p className="eyebrow">Challenge {activeIndex + 1} of {exercises.length}</p><h2>{exercise.title}</h2>
        <div className="tags"><span>{exercise.difficulty}</span>{exercise.concepts.map((tag) => <span key={tag}>{tag}</span>)}</div><p className="prompt">{exercise.prompt}</p>
        <details><summary>Need a hint?</summary><p>{exercise.hint}</p></details>
      </section>
      <section className="editor"><div className="panel-heading"><h3>Query editor</h3><button className="text-button" onClick={() => setDrafts({ ...drafts, [exercise.id]: exercise.starterSql })}>Reset query</button></div>
        <textarea aria-label="SQL query" value={drafts[exercise.id] ?? ""} spellCheck={false} onChange={(e) => setDrafts({ ...drafts, [exercise.id]: e.target.value })} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); void execute(false); } }} />
        <div className="actions"><button className="secondary" disabled={busy} onClick={() => void execute(false)}>Run query <kbd>⌘↵</kbd></button><button className="primary" disabled={busy} onClick={() => void execute(true)}>Check answer</button></div>
        {busy && <p role="status">Running query…</p>}{feedback && <p role="alert" className={`feedback ${feedback.status}`}>{feedback.status === "pass" ? "Correct result. Exercise marked complete." : feedback.message}</p>}
      </section>
      <section className="result panel"><div className="panel-heading"><h3>Result</h3>{result && <span>{result.rows.length} row{result.rows.length === 1 ? "" : "s"}</span>}</div>{result ? <ResultTable result={result} /> : <p className="empty">Run a query to inspect its result.</p>}</section>
    </main>
    <aside className="schema panel"><p className="eyebrow">Database</p><h2>Schema</h2>{schema?.ok ? schema.schema.map((table) => <div className="table-schema" key={table.name}><h3>{table.name}</h3>{table.columns.map((column) => <div key={column.name}><code>{column.name}</code><span>{column.type}{column.primaryKey ? " · PK" : ""}</span></div>)}</div>) : <p>{schema && !schema.ok ? schema.error.message : "Loading schema…"}</p>}</aside>
    <footer><button disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}>← Previous</button><span>{activeIndex + 1} / {exercises.length}</span><button disabled={activeIndex === exercises.length - 1} onClick={() => select(activeIndex + 1)}>Next →</button></footer>
  </div>;
}

function ResultTable({ result }: { result: QueryResult }) {
  return <div className="table-scroll"><table><thead><tr>{result.columns.map((column, i) => <th key={`${column}-${i}`}>{column}</th>)}</tr></thead><tbody>{result.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell === null ? <em>NULL</em> : cell}</td>)}</tr>)}</tbody></table></div>;
}
