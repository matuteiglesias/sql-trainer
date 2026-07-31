export type QueryValue = string | number | null;

export type QueryResult = {
  columns: string[];
  rows: QueryValue[][];
};

export type EngineErrorKind = "load" | "syntax" | "execution" | "protocol" | "timeout";

export type EngineError = {
  kind: EngineErrorKind;
  message: string;
};

export type EngineOutcome =
  | { ok: true; result: QueryResult }
  | { ok: false; error: EngineError };

export type SchemaColumn = {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
};

export type SchemaTable = {
  name: string;
  columns: SchemaColumn[];
};

export type SchemaOutcome =
  | { ok: true; schema: SchemaTable[] }
  | { ok: false; error: EngineError };
