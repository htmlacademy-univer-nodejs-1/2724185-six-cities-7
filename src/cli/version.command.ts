import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import chalk from 'chalk';
import type {Command} from './command.interface.js';

export class VersionCommand implements Command {
  public readonly name = '--version';

  public async execute(): Promise<void> {
    const packagePath = fileURLToPath(new URL('../../package.json', import.meta.url));
    const packageContent = await readFile(packagePath, {encoding: 'utf-8'});
    const packageJson: unknown = JSON.parse(packageContent);

    if (
      typeof packageJson !== 'object' ||
      packageJson === null ||
      !('version' in packageJson) ||
      typeof packageJson.version !== 'string'
    ) {
      throw new Error('В package.json не указана версия.');
    }

    console.info(chalk.green(packageJson.version));
  }
}
