import { log } from "./logger";
import { Account, Person, NormalizedData } from "./types";

/**
 * Merge all accounts based on matching emails
 * @param accounts
 * @returns person records
 */
export const merge = (accounts: Account[]): Person[] | undefined => {
  const normalizedData = normalizeAccountsByEmail(accounts);
  log("normalized data:", normalizedData);

  return Object.keys(normalizedData).reduce<Person[]>((people, email) => {
    const myEmails: string[] = [];
    const linkedEmails: string[] = gatherLinkedAccounts(
      normalizedData,
      normalizedData[email],
      myEmails
    );
    log("linked account emails (", email, ") -", linkedEmails);

    if (!getPersonRecord(people, linkedEmails)) {
      // no record found, create a new person record for this set of emails
      const newPerson = convertEmailsToPersonAccounts(
        normalizedData,
        linkedEmails
      );
      log("new person record:", newPerson);

      people.push(newPerson);
    }

    return people;
  }, []);
};

/**
 * Normalize account data to make look up by email easier
 * @param accounts
 * @returns Account data map keyed by email
 */
const normalizeAccountsByEmail = (accounts: Account[]): NormalizedData =>
  accounts.reduce<NormalizedData>((result, account) => {
    account.emails.forEach((email) => {
      if (!result[email]) {
        result[email] = [];
      }
      result[email] = [...result[email], account];
    });
    return result;
  }, {});

/**
 * Recursively gather all emails in other owned accounts
 *
 * @param normalizedData
 * @param myAccounts
 * @param myEmails
 * @returns Email list
 */
const gatherLinkedAccounts = (
  normalizedData: NormalizedData,
  myAccounts: Account[],
  myEmails: string[]
): string[] => {
  myAccounts.forEach(({ emails }) => {
    emails.forEach((email) => {
      if (!myEmails.includes(email)) {
        // new email found, keep track of this record
        myEmails.push(email);

        // recursively check for others
        return gatherLinkedAccounts(
          normalizedData,
          normalizedData[email],
          myEmails
        );
      }
    });
  });

  return myEmails;
};

/**
 * Search for Person record by provided emails
 * @param people
 * @param emails
 * @returns Person | undefined
 */
const getPersonRecord = (
  people: Person[],
  emails: Account["emails"]
): Person | undefined =>
  people.find((person: Person) =>
    person.emails.some((email) => emails.includes(email))
  );

/**
 * Flatten all linked email records into a person record
 * @param normalizedData
 * @param linkedEmails
 * @returns Person
 */
const convertEmailsToPersonAccounts = (
  normalizedData: NormalizedData,
  linkedEmails: Account["emails"]
): Person =>
  linkedEmails.reduce<Person>(
    (person, email) => {
      normalizedData[email].forEach(({ application, name }: Account) => {
        person.name = name;
        person.applications = addUnique<number>(person.applications, [
          application,
        ]);
        person.emails = addUnique<string>(person.emails, [email]);
      });

      return person;
    },
    {
      name: "",
      applications: [],
      emails: [],
    }
  );

/**
 * Combine all values from arr1 and arr2 without duplicates
 * @param arr1
 * @param arr2
 * @returns new array, with unique values
 */
const addUnique = <T>(arr1: T[], arr2: T[]): T[] => [
  ...new Set([...arr1, ...arr2]),
];
