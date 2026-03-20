export function approvalGate(task, supervision) {
  if (!supervision.requires_owner_approval) return true;

  if (task.approvedBy !== supervision.owner_id) {
    return false;
  }

  return true;
}
