export function readOnlyGuard(task, permissions) {
  if (permissions.mode === "read-only") {
    if (task.type === "write" || task.type === "modify" || task.type === "delete") {
      return false;
    }
  }
  return true;
}
