/**
 * Formats the final output for display in Bozitivez.
 * Ensures accessibility, structure, and sponsor-friendly clarity.
 */

export function formatForUI(data) {
  return {
    agent: "Bozitivez",
    rendered_at: new Date().toISOString(),
    layout: "standard",
    content: data
  };
}
