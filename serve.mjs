// Serves the standalone verifier locally: node packages/verifier/serve.mjs [port]
// The verifier is one static file; this exists only because browsers restrict
// pages opened from file:// URLs.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const page = join(dirname(fileURLToPath(import.meta.url)), "index.html");
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);

createServer(async (request, response) => {
  if (request.url !== "/" && request.url !== "/index.html") {
    response.writeHead(404).end("not found");
    return;
  }
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(await readFile(page));
}).listen(port, "127.0.0.1", () => console.log(`verifier at http://127.0.0.1:${port}/`));
