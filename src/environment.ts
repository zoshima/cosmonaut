import * as fs from "fs";

export interface AppSettings {
  database: {
    hostname: string;
    key: string;
    port: number;
    gremlin: { port: number };
  };
}

export class Environment {
  private static _instance: Environment;
  private _settings: AppSettings;

  constructor() {
    const settings: string = fs.readFileSync("appsettings.json", "utf8");

    this._settings = JSON.parse(settings);
  }

  public static get instance(): Environment {
    if (!this._instance) {
      this._instance = new Environment();
    }

    return this._instance;
  }

  public get settings(): AppSettings {
    return this._settings;
  }
}
