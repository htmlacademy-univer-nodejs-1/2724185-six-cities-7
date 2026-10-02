import chalk from 'chalk';
import type {Command} from './command.interface.js';
import {TsvFileReader} from '../shared/libs/file-reader/tsv-file-reader.js';

export class ImportCommand implements Command {
  public readonly name = '--import';

  public async execute(parameters: string[]): Promise<void> {
    const [filepath] = parameters;

    if (!filepath) {
      throw new Error('Для команды --import укажите путь к TSV-файлу.');
    }

    const fileReader = new TsvFileReader(filepath);
    const offers = await fileReader.read();

    console.info(chalk.bold.green(`Импортировано предложений: ${offers.length}`));
    offers.forEach(({title, city}, index) => {
      console.info(chalk.yellow(`${index + 1}. ${title} (${city.name})`));
    });
  }
}
