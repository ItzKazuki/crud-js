import chalk from 'chalk';

//with console.log
const success = (message) => console.log(chalk.green(message));
const pending = (message) => console.log(chalk.yellow(message));
const failed = (message) => console.log(chalk.red('failed:', message));
const error = (message) => console.log(chalk.redBright('error:', message))
const danger = (message) => console.log(chalk.red(message));
const info = (message) => console.log(chalk.blue(message));

//without console.log
const ncInfo = (message) => chalk.blue(message);

export { success, pending, failed, info, error, danger, ncInfo };