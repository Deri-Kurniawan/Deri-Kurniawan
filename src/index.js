import { log, makeDir, readDir, writeFile, readFile } from "./lib/index.js";

async function createSettingsFile(baseDir, markdownFiles, settingsFileName) {
  try {
    const defaultPriority = markdownFiles.map((file) =>
      file.replace(".md", "")
    );

    await writeFile(
      `${baseDir}/${settingsFileName}`,
      JSON.stringify({ priority: defaultPriority }, null, 2)
    );

    log("success", `${settingsFileName} created successfully`);
  } catch (error) {
    log("error", `Failed to create ${settingsFileName}`);
    throw error;
  }
}

async function generateREADME(baseDir, compiledFileName, settingsFileName) {
  try {
    const files = await readDir(baseDir);
    const markdownFiles = files.filter(
      (file) => file.includes(".md") && !file.startsWith("_")
    );

    if (!markdownFiles.length) {
      log("error", "No Markdown files found in the directory.");
      return;
    }

    const settingsFile = files.find((file) => file.includes(settingsFileName));

    if (!settingsFile) {
      await createSettingsFile(baseDir, markdownFiles, settingsFileName); // Pass settingsFileName here
    }

    const data = await readFile(`${baseDir}/${settingsFileName}`);
    const settings = JSON.parse(data);

    // Add any missing .md files to the priority list
    const missingFiles = markdownFiles.filter(
      (file) => !settings.priority.includes(file.replace(".md", ""))
    );

    if (missingFiles.length > 0) {
      settings.priority.push(
        ...missingFiles.map((file) => file.replace(".md", ""))
      );
      await writeFile(
        `${baseDir}/${settingsFileName}`,
        JSON.stringify(settings, null, 2)
      );
      log(
        "success",
        `Missing .md files added to 'priority' in ${settingsFileName}`
      );
    }

    // Sort by priority
    markdownFiles.sort((a, b) => {
      const aPriority = settings.priority.indexOf(a.replace(".md", ""));
      const bPriority = settings.priority.indexOf(b.replace(".md", ""));
      return aPriority - bPriority;
    });

    // Create README.md by joining the content
    const readmeContent = await Promise.all(
      markdownFiles.map(async (file) => {
        const fileContent = await readFile(`${baseDir}/${file}`);
        return `${fileContent}\n`;
      })
    );

    await writeFile(compiledFileName, readmeContent.join("\n"));
    log("success", "README.md generated successfully");
  } catch (error) {
    log("error", "An error occurred during README.md generation.");
    throw error;
  }
}

async function main() {
  const baseDir = "./src/components";
  const compiledFileName = "./README.md";
  const settingsFileName = "settings.json";
  try {
    await generateREADME(baseDir, compiledFileName, settingsFileName);
  } catch (error) {
    makeDir("./src/components");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
