"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
const dotenv = __importStar(require("dotenv"));
const fs_1 = require("fs");
let conf = { override: true, quiet: true };
// Vérifie si la variable DOTENV_CONFIG_PATH est définie
const envPath = process.env['DOTENV_CONFIG_PATH'];
if (envPath) {
    console.log(`Using ${envPath} environement file`);
    conf.path = envPath;
}
const result = dotenv.config(conf);
if (result.error) {
    console.log("No valid .env file found");
}
function get_from_file(filename) {
    if (!filename) {
        return undefined;
    }
    try {
        return (0, fs_1.readFileSync)(filename, "utf8").trim();
    }
    catch {
        return undefined;
    }
}
function getEnv(varName, opts) {
    let value = process.env[varName];
    if (value != undefined) {
        return value;
    }
    if (opts && 'file' in opts && opts.file == true) {
        let filename = process.env[`${varName}_FILE`];
        let value = get_from_file(filename);
        if (value != undefined) {
            return value;
        }
    }
    if (opts && 'fallback' in opts) {
        return opts.fallback;
    }
    throw new Error(`Variable ${varName} is not defined`);
}
