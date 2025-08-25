export interface EnvOptions {
    file?: boolean;
    fallback?: string;
}
export declare function getEnv(varName: string, opts?: EnvOptions): string;
