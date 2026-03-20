import { approvalGate } from "./approvalGate.js";
import { readOnlyGuard } from "./readOnlyGuard.js";
import { routeTask } from "./taskRouter.js";
import fs from "fs";

export async function bozangive(task) {
  // Load config
  const permissions = JSON.parse(fs.readFileSync("./config/permissions.json"));
  const supervision = JSON.parse(fs.readFileSync("./config/supervision.json"));

  // Step 1: Approval required
  const approved = approvalGate(task, supervision);
  if (!approved) {
    return {
      status: "denied",
      reason: "Task requires explicit approval from BossBozitive."
    };
  }

  // Step 2: Enforce read-only mode
  const safe = readOnlyGuard(task, permissions);
  if (!safe) {
    return {
      status: "blocked",
      reason: "Task violates read-only restrictions."
    };
  }

  // Step 3: Execute task
  return await routeTask(task);
}
