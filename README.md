# Account gathering

## Project setup

Install all dependencies via yarn or npm

```
yarn | npm install
```

## Available scripts

- `test` - Run application main function, prints out merged list of accounts
  provided in the `<root_dir>/accounts.json` file

### Available flags

- `--debug` - show debug logs as the data is traversed

```
yarn test [--debug]

npm test [--debug=true]
```
