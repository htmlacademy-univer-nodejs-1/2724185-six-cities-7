import chalk from 'chalk';
import type {Command} from './command.interface.js';

const HELP_MESSAGE = `
Программа для подготовки данных для REST API сервера.

Пример: npm run cli -- <command> [arguments]

Команды:
  --help                      Печатает этот текст
  --version                   Выводит номер версии
  --import <filepath>         Импортирует данные из TSV
`;

export class HelpCommand implements Command {
  public readonly name = '--help';

  public execute(): void {
    console.info(chalk.cyan(HELP_MESSAGE));
  }
}
