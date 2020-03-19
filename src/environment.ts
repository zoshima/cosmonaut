import * as fs from "fs";
import {Configuration} from "src/models";

export class Environment {
  private static path: string = "./dist/configs"; // TODO: why is path not relative to /dist?
  private static _instance: Environment;
  private _configurations: Configuration[];

  constructor() {
    this._configurations = null;
  }

  public static get instance(): Environment {
    if (!this._instance) {
      this._instance = new Environment();
    }

    return this._instance;
  }

  public get configurations(): Configuration[] {
    if (this._configurations == null) {
      this._configurations = [];
      const filenames: string[] = fs.readdirSync(Environment.path);

      for (const filename of filenames) {
        const content: string = fs.readFileSync(
          `${Environment.path}/${filename}`,
          "utf8"
        );
        const configuration: Configuration = JSON.parse(content);

        this._configurations.push(configuration);
      }
    }

    return this._configurations;
  }

  public setConfiguration(configuration: Configuration): void {
    const filename: string = `${configuration.id}.json`;
    const content: string = JSON.stringify(configuration);

    fs.writeFileSync(`${Environment.path}/${filename}`,
      content,
      "utf8"
    );

    this._configurations = null; // force reload
  }

  public deleteConfiguration(configuration: Configuration): void {
    const filename: string = `${configuration.id}.json`;

    fs.unlinkSync(`${Environment.path}/${filename}`);

    this._configurations = null; // force reload
  }
}
