import { readdirSync } from "fs";
import { getRandomString } from "./random.js";

function getFileNames(fullPathToDir: string): string[] {
  return readdirSync(fullPathToDir).map(fileName => {
    return fileName.replace(/\.\w+$/, "");
  });
}

export function uniqueFileName(fullPathToDir: string, fileNames: string[] = []): string {
  fileNames.length || (fileNames = getFileNames(fullPathToDir));
  const randomName = getRandomString(32);
  if (fileNames.includes(randomName))
    return uniqueFileName(fullPathToDir, fileNames);
  return randomName;
}