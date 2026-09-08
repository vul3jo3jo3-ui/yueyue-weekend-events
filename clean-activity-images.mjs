import { readdir, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const imagesDirectory = resolve(root, "assets/events");
const html = await readFile(resolve(root, "index.html"), "utf8");
const referenced = new Set(
  [...html.matchAll(/image:\s*"assets\/events\/([^"\n]+)"/g)].map((match) => match[1])
);

let removed = 0;
for (const entry of await readdir(imagesDirectory, { withFileTypes: true })) {
  if (entry.isFile() && !referenced.has(entry.name)) {
    await rm(resolve(imagesDirectory, entry.name));
    removed += 1;
  }
}

console.log(`Removed ${removed} unreferenced activity image(s).`);
