// Checks this copy of the Receipts verifier against its release record, with
// nothing but Node: node check.mjs
//
// It checks that attestors.json lists the same anchor keys the verifier
// carries, and that each file's SHA-256 is the one the newest release in
// releases.json gives. It exits 1 if anything doesn't match.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(join(here, name));
let failed = false;
const report = (ok, line) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${line}`);
  if (!ok) failed = true;
};

// The verifier carries its anchor keys as a JSON array on one statement.
const embedded = /const ANCHOR_ATTESTORS = ([\s\S]*?);\r?\n/.exec(read("index.html").toString("utf8"));
const attestors = JSON.parse(read("attestors.json").toString("utf8"));
const releases = JSON.parse(read("releases.json").toString("utf8"));

const key = (k) => JSON.stringify([k.chainId, k.address, k.from, k.until]);
if (!embedded) {
  report(false, "index.html carries no ANCHOR_ATTESTORS list");
} else {
  const carried = JSON.parse(embedded[1]).map(key);
  const listed = attestors.anchor.map(key);
  report(
    carried.length === listed.length && carried.every((k, i) => k === listed[i]),
    `the verifier carries the ${listed.length} anchor key(s) attestors.json lists`,
  );
}

report(
  releases.every((r, i) => r.release === i + 1),
  `releases are numbered 1 to ${releases.length} in order`,
);
const newest = releases.at(-1);
if (!newest) {
  report(false, "releases.json lists no release");
} else {
  for (const [name, digest] of Object.entries(newest.sha256)) {
    const actual = createHash("sha256").update(read(name)).digest("hex");
    report(actual === digest, `${name} is release ${newest.release}'s (sha256 ${actual})`);
  }
}

if (failed) process.exitCode = 1;
