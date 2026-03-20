import fs from "fs";

/**
 * Generates a structured system map for a given repository.
 * This file is written ONLY inside Bozangive's own reports folder.
 * No external repositories are ever modified.
 */

export function writeSystemMap(repo, structure) {
  const output = {
    agent: "Bozangive",
    role: "Apprentice (Read-Only)",
    repo,
    generated_at: new Date().toISOString(),
    structure
  };

  try {
    fs.writeFileSync(
      "./reports/systemMap.json",
      JSON.stringify(output, null, 2)
    );

    return {
      status: "ok",
      file: "systemMap.json",
      message: "System map written successfully."
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to write system map.",
      error: error.message
    };
  }
}
