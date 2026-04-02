import fs from "fs";
import path from "path";
import { bozangive } from "./core/index.js";
import { adaptUiPayloadToTask } from "./integration/uiAdapter.js";

function loadUiPayload() {
  const examplePath = path.resolve("./integration/examples/task_payload.json");
  const raw = fs.readFileSync(examplePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const uiPayload = loadUiPayload();

  const adapted = adaptUiPayloadToTask(uiPayload, {
    repoRoot: process.cwd(),
    timestamp: uiPayload.timestamp
  });

  if (adapted.status !== "ok") {
    console.error(JSON.stringify(adapted, null, 2));
    process.exitCode = 1;
    return;
  }

  const task = {
    ...adapted.task,
    approvedBy: "BossBozitive"
  };

  const result = await bozangive(task);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
