export async function routeTask(task) {
  switch (task.action) {
    case "inventory": {
      const fs = await import("fs");
      const path = await import("path");
      const { writeSystemMap } = await import(
        "../reports/systemMapGenerator.js"
      );

      if (task?.policy?.usePageContent !== false) {
        return {
          status: "blocked",
          reason: "policy.usePageContent must be false"
        };
      }

      const repoRoot = task.repoRoot ?? process.cwd();

      const walk = (rootDir, relDir) => {
        const absDir = path.join(rootDir, relDir);
        const entries = fs.readdirSync(absDir, { withFileTypes: true });
        entries.sort((a, b) => a.name.localeCompare(b.name));

        const nodes = [];
        for (const entry of entries) {
          if (entry.name === ".git" || entry.name === "node_modules") continue;

          const normalizedRelDir = relDir.split("\\").join("/");
          const relPath = path.posix.join(normalizedRelDir, entry.name);
          const absPath = path.join(rootDir, relPath);

          if (entry.isDirectory()) {
            nodes.push({
              path: relPath + "/",
              type: "dir",
              children: walk(rootDir, relPath)
            });
          } else {
            const stat = fs.statSync(absPath);
            nodes.push({
              path: relPath,
              type: "file",
              size: stat.size
            });
          }
        }

        return nodes;
      };

      const structure = walk(repoRoot, "");

      const systemMapResult = writeSystemMap(task.repo ?? "local", structure, {
        generated_at: task.timestamp
      });

      const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bozangive Reports</title>
    <style>
      body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;margin:24px;max-width:900px}
      code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
      pre{background:#0b1020;color:#e6edf3;padding:16px;border-radius:10px;overflow:auto}
      a{color:#2563eb}
    </style>
  </head>
  <body>
    <h1>Bozangive Reports</h1>
    <p>Generated deterministically with <code>policy.usePageContent=false</code>.</p>
    <p><a href="./systemMap.json">systemMap.json</a></p>
    <p><a href="./crossRepoDocs.html">crossRepoDocs.html</a></p>
    <p><a href="./crossRepoDocs.json">crossRepoDocs.json</a></p>
    <pre id="out">Loading…</pre>
    <script>
      fetch('./systemMap.json')
        .then(r => r.json())
        .then(j => {
          document.getElementById('out').textContent = JSON.stringify(j, null, 2);
        })
        .catch(e => {
          document.getElementById('out').textContent = String(e);
        });
    </script>
  </body>
</html>`;

      fs.writeFileSync("./reports/index.html", html);

      return {
        status: "ok",
        repo: task.repo ?? "local",
        report: {
          systemMap: systemMapResult,
          index: "index.html"
        }
      };
    }
    case "crawl":
      return await (await import("../github/repoCrawler.js")).crawlRepo(
        task.repo
      );
    case "extract_md":
      return await (await import("../github/mdExtractor.js")).extractMarkdown(
        task.repo
      );
    case "classify":
      return await (await import("../github/fileClassifier.js")).classifyFiles(
        task.repo
      );
    case "summarize":
      return await (
        await import("../github/summaryGenerator.js")
      ).generateSummary(task.repo, { policy: task.policy });
    default:
      return { status: "error", message: "Unknown task action." };
  }
}
