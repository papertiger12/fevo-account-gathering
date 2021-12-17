import { merge } from "./utils";
import { getJsonFromFile } from "./fileUtils";
import { Account, Person } from "./types";

const main = () => {
  const accountData: Account[] =
    getJsonFromFile<Account>("accounts.json") ?? [];
  const result: Person[] = merge(accountData) ?? [];
  console.log("Result:\n", result);
};

main();
