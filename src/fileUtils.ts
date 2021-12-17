const fs = require("fs");
const path = require("path");

export const getJsonFromFile = <T>(fileName: string): T[] | undefined => {
  try {
    const rawAccounts = fs.readFileSync(path.join(fileName));
    return JSON.parse(rawAccounts.toString()) as T[];
  } catch (e) {
    console.error(e);
  }
};
