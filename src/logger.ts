const argv = require("minimist")(process.argv.slice(2));

/**
 * Logging utility, will only print if project is run with the
 * --debug flag
 * @param args
 */
export const log = (...args: any) => {
  argv.debug && console.log(...args);
};
