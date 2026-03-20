import { crawlRepo } from "../github/repoCrawler.js";
import { extractMarkdown } from "../github/mdExtractor.js";
import { classifyFiles } from "../github/fileClassifier.js";
import { generateSummary } from "../github/summaryGenerator.js";

export async function routeTask(task) {
  switch (task.action) {
    case "crawl":
      return await crawlRepo(task.repo);
    case "extract_md":
      return await extractMarkdown(task.repo);
    case "classify":
      return await classifyFiles(task.repo);
    case "summarize":
      return await generateSummary(task.repo);
    default:
      return { status: "error", message: "Unknown task action." };
  }
}
