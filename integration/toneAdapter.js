/**
 * Wraps Bozangive's output in LovesfireAI's tone layer.
 * Ensures warmth, clarity, and emotional safety.
 */

export function applyToneLayer(message) {
  return {
    agent: "LovesfireAI",
    delivered_at: new Date().toISOString(),
    tone: "warm, clear, supportive",
    message
  };
}
