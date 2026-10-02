import chalk from 'chalk';
import type {Command} from './command.interface.js';

export class CliApplication {
  private readonly commands = new Map<string, Command>();

  constructor(commands: Command[]) {
    commands.forEach((command) => {
      this.commands.set(command.name, command);
    });
  }

  public async run(argv: string[]): Promise<void> {
    const [commandName = '--help', ...parameters] = argv;
    const command = this.commands.get(commandName);

    if (!command) {
      console.error(chalk.red(`Неизвестная команда: ${commandName}`));
      await this.commands.get('--help')?.execute([]);
      process.exitCode = 1;
      return;
    }

    await command.execute(parameters);
  }
}
