export interface Account {
  application: number;
  emails: string[];
  name: string;
}

export interface Person extends Omit<Account, "application"> {
  applications: number[];
}

export type ReduceResult<T> = {
  [key: string]: Array<T>;
};

export type NormalizedData = ReduceResult<Account>;
