export function readOnlyGuard(task, permissions) {
  const mode = permissions?.mode ?? permissions?.permissions?.mode;

  if (mode === "read-only") {
    if (
      task.type === "write" ||
      task.type === "modify" ||
      task.type === "delete"
    ) {
      return false;
    }
  }
  return true;
}
