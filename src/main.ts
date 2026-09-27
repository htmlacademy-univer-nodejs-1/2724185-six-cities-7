#!/usr/bin/env node

import chalk from 'chalk';
import {CliApplication} from './cli/cli-application.js';
import {HelpCommand} from './cli/help.command.js';
import {ImportCommand} from './cli/import.command.js';
import {VersionCommand} from './cli/version.command.js';

const cliApplication = new CliApplication([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
]);

try {
  await cliApplication.run(process.argv.slice(2));
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`Ошибка: ${message}`));
  process.exitCode = 1;
}
