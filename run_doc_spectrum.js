import fs from "fs";
import path from "path";

function posixify(p) {
  return p.split(path.sep).join(path.posix.sep);
}

function isDenied(relPathPosix) {
  const lower = relPathPosix.toLowerCase();
  if (lower.endsWith("encrypted_secrets.md")) return true;
  if (lower.includes("/private_keys/")) return true;
  if (lower.includes("/sensitive/")) return true;
  return false;
}

function walkMdFiles(rootDir) {
  const results = [];

  const walk = (absDir) => {
    const entries = fs.readdirSync(absDir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const ent of entries) {
      const abs = path.join(absDir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === ".git" || ent.name === "node_modules") continue;
        walk(abs);
        continue;
      }

      if (!ent.isFile()) continue;
      if (!ent.name.toLowerCase().endsWith(".md")) continue;

      const rel = posixify(path.relative(rootDir, abs));
      if (isDenied(rel)) continue;

      results.push({ absPath: abs, relPath: rel });
    }
  };

  walk(rootDir);
  results.sort((a, b) => a.relPath.localeCompare(b.relPath));
  return results;
}

function extractHeadings(md) {
  const lines = md.split(/\r?\n/);
  const headings = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.*)$/);
    if (m) headings.push({ level: m[1].length, text: m[2].trim() });
  }
  return headings;
}

function extractLinks(md) {
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    links.push({ text: m[1], href: m[2] });
  }
  return links;
}

function extractSignals(md) {
  const lower = md.toLowerCase();
  const signals = {
    hasGovernance: lower.includes("governance"),
    hasConstitution: lower.includes("constitution"),
    hasPolicy: lower.includes("policy"),
    hasSecurity: lower.includes("security"),
    hasVersioning: lower.includes("version"),
    hasArchitecture: lower.includes("architecture"),
    hasContracts: lower.includes("contract"),
    hasAudit: lower.includes("audit"),
    hasAccessibility: lower.includes("accessibility") || lower.includes("asl") || lower.includes("braille"),
    hasDeterminism: lower.includes("determin") || lower.includes("reproduc") || lower.includes("drift")
  };
  return signals;
}

function stableIsoNow() {
  return new Date().toISOString();
}

function ensureReportsDir() {
  if (!fs.existsSync("./reports")) fs.mkdirSync("./reports", { recursive: true });
}

function renderHtml(report) {
  const esc = (s) => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const repos = report.repos
    .map(r => `<section style="margin:24px 0">
  <h2>${esc(r.repoId)}</h2>
  <p><b>Root:</b> <code>${esc(r.root)}</code></p>
  <p><b>Markdown files:</b> ${r.files.length}</p>
  <ul>
    ${r.files.slice(0, 200).map(f => `<li><code>${esc(f.relPath)}</code></li>`).join("\n")}
  </ul>
</section>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cross-Repo Docs Spectrum</title>
    <style>
      body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;margin:24px;max-width:1000px}
      code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
      pre{background:#0b1020;color:#e6edf3;padding:16px;border-radius:10px;overflow:auto}
      a{color:#2563eb}
      section{border-top:1px solid #e5e7eb;padding-top:12px}
    </style>
  </head>
  <body>
    <h1>Cross-Repo Docs Spectrum</h1>
    <p><b>Generated at:</b> <code>${esc(report.generated_at)}</code></p>
    <p><a href="./crossRepoDocs.json">crossRepoDocs.json</a></p>
    ${repos}
    <h2>Raw JSON</h2>
    <pre id="out">Loading…</pre>
    <script>
      fetch('./crossRepoDocs.json')
        .then(r => r.json())
        .then(j => { document.getElementById('out').textContent = JSON.stringify(j, null, 2); })
        .catch(e => { document.getElementById('out').textContent = String(e); });
    </script>
  </body>
</html>`;
}

async function main() {
  const repos = [
    { repoId: "boswellmike68-bot/Bozangive", root: process.cwd() },
    { repoId: "boswellmike68-bot/BBnCC", root: "C:/Downloads/BBnCC/BBnCC-main" },
    { repoId: "boswellmike68-bot/Bozitivez", root: "C:/Downloads/Bozitivez/Bozitivez-main" },
    { repoId: "boswellmike68-bot/LovesfireAI", root: "C:/Downloads/LovesfireAI/LovesfireAI-main" }
  ];

  const out = {
    agent: "Bozangive",
    generated_at: stableIsoNow(),
    deny: ["**/encrypted_secrets.md", "private_keys/**", "sensitive/**"],
    repos: []
  };

  for (const repo of repos) {
    if (!fs.existsSync(repo.root)) {
      out.repos.push({ ...repo, status: "missing", files: [] });
      continue;
    }

    const mdFiles = walkMdFiles(repo.root);
    const files = [];

    for (const f of mdFiles) {
      const buf = fs.readFileSync(f.absPath);
      const md = buf.toString("utf8");
      const stat = fs.statSync(f.absPath);

      const headings = extractHeadings(md);
      const links = extractLinks(md);
      const signals = extractSignals(md);

      files.push({
        relPath: f.relPath,
        size: stat.size,
        headings,
        linkCount: links.length,
        signals
      });
    }

    out.repos.push({
      ...repo,
      status: "ok",
      files
    });
  }

  ensureReportsDir();
  fs.writeFileSync("./reports/crossRepoDocs.json", JSON.stringify(out, null, 2));
  fs.writeFileSync("./reports/crossRepoDocs.html", renderHtml(out));

  console.log(
    JSON.stringify(
      {
        status: "ok",
        files: ["reports/crossRepoDocs.json", "reports/crossRepoDocs.html"]
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
