export async function classifyFiles(repoData) {
  const classifications = repoData.files.map(file => {
    const isPlaceholder =
      file.name.toLowerCase().includes("placeholder") ||
      file.name.toLowerCase().includes("temp") ||
      file.name.toLowerCase().includes("old");

    return {
      name: file.name,
      path: file.path,
      type: file.type,
      classification: isPlaceholder ? "placeholder" : "real"
    };
  });

  return {
    status: "ok",
    repo: repoData.repo,
    classifications
  };
}
