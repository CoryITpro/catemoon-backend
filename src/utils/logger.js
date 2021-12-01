/* eslint-disable no-console */
const chalk = require("chalk");
const ip = require("ip");

const getIsoString = () => {
  const date = new Date(null);

  // Specify value for SECONDs HERE
  date.setMilliseconds(Date.now());

  return chalk.greenBright.bgGray(
    `[${date
      .toISOString()
      .replace("-", "/")
      .replace("-", "/")
      .replace("T", " - ")
      .replace("Z", "")
      .substr(0, 21)}]`
  );
};

const divider = chalk.green("\n----------------------------------------\n");

/**
 * @dev Logger middleware
 * You can customize it to make it more personal
 */
const logger = {
  // Call whenever there is a log on the server you want to print
  log: (log) => {
    console.log(`${getIsoString()} ${chalk.green(log)}`);
  },

  // Call whenever there is an error on the server you want to print
  error: (err) => {
    console.error(`${getIsoString()} ${chalk.red(err)}`);
  },

  // Call whenever express app starts on given port w/o errors
  appStarted: (port, host, tunnelStarted) => {
    console.log(`\n${getIsoString()} Server Started! ${chalk.green("✓")}\n`);

    // If the tunnel started, log that and the URL it's available at
    if (tunnelStarted) {
      console.log(`Tunnel initialised ${chalk.green("✓")}`);
    }

    console.log(
      `${chalk.bold("Access URLs:")}
      ${divider}
      Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${
        chalk.magenta(`http://${ip.address()}:${port}`) +
        (tunnelStarted ? `\nProxy: ${chalk.magenta(tunnelStarted)}` : "")
      }
      ${divider}
      ${chalk.yellow(`Press ${chalk.italic("CTRL-C")} to stop\n`)}`
    );
  },
};

module.exports = logger;
