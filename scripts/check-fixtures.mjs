import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const exerciseDirectory = new URL("../fixtures/target/public/content/exercises/", import.meta.url);
const database = new URL("../fixtures/target/public/db/hospital_v0_1.sqlite", import.meta.url);
const expectedHashes = {
  "hospital-001-male-patients.json": "59ef8991b8c5a4cc25ac2d89cb9ececaa19a01ebd95cac75f0e0a9a09cd42416",
  "hospital-002-missing-allergies.json": "6e173d2d544e4a5805908cfd247527fe484d2c49c349f1d345d5f1d072f4e931",
  "hospital-003-names-starting-c.json": "3cc7b68b333dee963f80d800bb41e8fe5d688543e05ddb33c84761cbba7252c6",
  "hospital-004-weight-range-inclusive.json": "7418b8ec9990e87a166f8efef66399480aa16492ee6e33074e68f211e804591f",
  "hospital-005-province-names.json": "72c6b71861e17e3ae1942e7c4e355f6109c3cd07d1fdda68e72d05ff14bae04b",
  "index.json": "04387c2b736e36d4fb8ef2a81bcf6867e484534e711ab4a700f01ef2ad2f2bbb",
};
const expectedDatabaseHash = "937f8e5e257d9114d73515a116f6957e4dcc19bc4b40f2ed3519a8a7f3adba76";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

const indexBytes = await readFile(new URL("index.json", exerciseDirectory));
const manifest = JSON.parse(indexBytes.toString("utf8"));
const index = manifest.exerciseFiles;

if (!Array.isArray(index) || index.length !== 5 || new Set(index).size !== 5) {
  throw new Error("Exercise index must contain exactly five unique entries.");
}

if (index.some((filename) => typeof filename !== "string" || !/^[a-z0-9-]+\.json$/.test(filename))) {
  throw new Error("Exercise index entries must be canonical JSON file names.");
}

const jsonFiles = (await readdir(exerciseDirectory))
  .filter((file) => file.endsWith(".json"))
  .sort();
const expectedFiles = ["index.json", ...index].sort();
if (JSON.stringify(jsonFiles) !== JSON.stringify(expectedFiles)) {
  throw new Error("Exercise directory must contain only the index and its five referenced files.");
}

for (const filename of expectedFiles) {
  const bytes = filename === "index.json" ? indexBytes : await readFile(new URL(filename, exerciseDirectory));
  JSON.parse(bytes.toString("utf8"));
  if (sha256(bytes) !== expectedHashes[filename]) {
    throw new Error(`Frozen fixture hash mismatch: ${filename}.`);
  }
}

const databaseInfo = await stat(database);
const databaseBytes = await readFile(database);
if (!databaseInfo.isFile() || databaseInfo.size === 0) {
  throw new Error("SQLite fixture must be a nonempty file.");
}
if (sha256(databaseBytes) !== expectedDatabaseHash) {
  throw new Error("Frozen fixture hash mismatch: hospital_v0_1.sqlite.");
}

console.log(`Verified ${index.length} exercises and ${join("fixtures", "target", "public", "db", "hospital_v0_1.sqlite")} (${databaseInfo.size} bytes), including frozen SHA-256 hashes.`);
