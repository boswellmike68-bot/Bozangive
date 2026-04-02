export function approvalGate(task, supervision) {
  const requiresOwnerApproval =
    supervision?.requires_owner_approval ??
    supervision?.supervision?.requires_owner_approval;
  const ownerId = supervision?.owner_id ?? supervision?.supervision?.owner_id;

  if (!requiresOwnerApproval) return true;

  if (task.approvedBy !== ownerId) {
    return false;
  }

  return true;
}
