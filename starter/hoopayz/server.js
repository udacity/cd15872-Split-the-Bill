// Provided local preview utility, not an assessed course task.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, extname, sep } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".md": "text/plain",
  ".json": "application/json",
};
const port = Number(process.env.PORT ?? process.argv[2] ?? 4175);
createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const path = resolve(
      root,
      `.${pathname.endsWith("/") ? pathname + "index.html" : pathname}`,
    );
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const data = readFileSync(path);
    response.writeHead(200, {
      "Content-Type": `${types[extname(path)] ?? "application/octet-stream"}; charset=utf-8`,
      "Cache-Control": "no-store",
    });
    response.end(data);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`HooPayz: http://localhost:${port}`),
);
