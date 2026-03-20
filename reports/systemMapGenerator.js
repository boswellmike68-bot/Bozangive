import fs from "fs";

export function writeSystemMap(repo, structure) {
  const output = {
    repo,
    generated_at: new Date().toISOString(),
    structure
  };

  fs.writeFileSync(
    "./reports/systemMap.json",
    JSON.stringify(output, null, 2)
  );

  return { status: "ok", file: "systemMap.json" };
}
