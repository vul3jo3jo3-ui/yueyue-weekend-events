import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const catalog = JSON.parse(await readFile(resolve(root, "activity-sources.json"), "utf8"));

if (!Array.isArray(catalog.sources) || catalog.sources.length === 0) {
  throw new Error("activity-sources.json must contain a non-empty sources array.");
}

const names = new Set();
for (const source of catalog.sources) {
  for (const field of ["name", "url", "region", "kind", "enabled"]) {
    if (!(field in source)) throw new Error(`Missing ${field} on a source entry.`);
  }
  if (names.has(source.name)) throw new Error(`Duplicate source name: ${source.name}`);
  if (typeof source.url !== "string" || !source.url.startsWith("https://")) {
    throw new Error(`Invalid HTTPS URL for ${source.name}`);
  }
  names.add(source.name);
}

console.log(`Validated ${catalog.sources.length} activity sources.`);
