import * as dotenv from 'dotenv';
import { DotenvConfigOptions } from 'dotenv';
import { readFileSync } from "fs";

export interface EnvOptions {
  file?: boolean;
  fallback?: string;
}

let conf:DotenvConfigOptions = { override: true, quiet: true};

// Vérifie si la variable DOTENV_CONFIG_PATH est définie
const envPath = process.env['DOTENV_CONFIG_PATH'];
if (envPath) {
  console.log(`Using ${envPath} environement file`)
  conf.path = envPath
}

const result = dotenv.config(conf);
if (result.error) {
  throw new Error(`Erreur lors du chargement du fichier .env à "${envPath}" : ${result.error.message}`);
}


function get_from_file(filename: string | undefined): string | undefined {
  if (!filename) {
    return undefined
  }

  try {
    return readFileSync(filename, "utf8").trim();
  } catch {
    return undefined
  }
  
}

export function getEnv(varName: string, opts?: EnvOptions ): string {
  let value = process.env[varName];
  if (value != undefined) {
    return value;
  }

  if (opts && 'file' in opts && opts.file == true) {
    let filename = process.env[`${varName}_FILE`];
    let value = get_from_file(filename)
    if (value != undefined) {
      return value;
    }
  }
  
  if (opts && 'fallback' in opts) {
    return opts.fallback as string;
  }

  throw new Error(`Variable ${varName} is not defined`);
}