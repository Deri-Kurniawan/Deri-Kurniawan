import chalk from "chalk";
import fs from "fs";

export const log = (status, message) => {
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  switch (status) {
    case "start":
      console.log(chalk.blue(`[${now}]`), chalk.gray(message));
      break;
    case "success":
      console.log(chalk.blue(`[${now}]`), chalk.green(message));
      break;
    case "error":
      console.log(chalk.blue(`[${now}]`), chalk.red(message));
      break;
    case "warning":
      console.log(chalk.blue(`[${now}]`), chalk.yellow(message));
      break;
    case "info":
      console.log(chalk.blue(`[${now}]`), chalk.blue(message));
      break;
    case "debug":
      console.log(chalk.blue(`[${now}]`), chalk.magenta(message));
      break;
    case "trace":
      console.log(chalk.blue(`[${now}]`), chalk.cyan(message));
      break;
    default:
      console.log(chalk.blue(`[${now}]`), message);
      break;
  }
};

export const clearLog = () => {
  console.clear();
};

export const readDir = (path) => {
  log("start", `Reading directory: ${path}`);
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        log("error", `Error reading directory: ${path}`);
        reject(err);
      } else {
        log("success", `Successfully read directory: ${path}`);
        resolve(files);
      }
    });
  });
};

export const makeDir = (path) => {
  log("start", `Creating directory: ${path}`);
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) {
        log("error", `Error creating directory: ${path}`);
        reject(err);
      } else {
        log("success", `Successfully created directory: ${path}`);
        resolve("The directory has been created!");
      }
    });
  });
};

export const readFile = (path) => {
  log("start", `Reading file: ${path}`);
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        log("error", `Error reading file: ${path}`);
        reject(err);
      } else {
        log("success", `Successfully read file: ${path}`);
        resolve(data);
      }
    });
  });
};

export const writeFile = (path, data) => {
  log("start", `Writing file: ${path}`);
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        log("error", `Error writing file: ${path}`);
        reject(err);
      } else {
        log("success", `Successfully wrote file: ${path}`);
        resolve("The file has been saved!");
      }
    });
  });
};
