# getEnv - Environment Variables Management Module

A simple and robust TypeScript module for retrieving environment variables with support for secret files and default values.

## Installation

```bash
npm install git+https://github.com/ph-pi/GetEnv.git
```

## Features

- ✅ Automatic `.env` file loading
- ✅ Secret files support (`_FILE` pattern)
- ✅ Configurable fallback values
- ✅ Explicit error handling
- ✅ Custom paths support via `DOTENV_CONFIG_PATH`

## Usage

### Import

```typescript
import { getEnv } from './index';
```

### Basic usage

```typescript
// Get an environment variable (throws error if not defined)
const dbHost = getEnv('DB_HOST');

// With a default value
const port = getEnv('PORT', { fallback: '3000' });
```

### Secret files support

Particularly useful for Docker Swarm or Kubernetes:

```typescript
// If DB_PASSWORD doesn't exist, look for the file content specified in DB_PASSWORD_FILE
const password = getEnv('DB_PASSWORD', { file: true });

// With fallback and file support
const apiKey = getEnv('API_KEY', { 
  file: true, 
  fallback: 'default-key' 
});
```

## Configuration

### Custom .env file

Set the `DOTENV_CONFIG_PATH` variable to use a specific .env file:

```bash
export DOTENV_CONFIG_PATH="/path/to/custom/.env"
```

### Available options

```typescript
interface EnvOptions {
  file?: boolean;     // Enable search via _FILE files
  fallback?: string;  // Default value if variable doesn't exist
}
```

## Usage examples

### Docker Secrets example

```typescript
// Environment variables or file contents
const dbUser = getEnv('POSTGRES_USER');
const dbPass = getEnv('POSTGRES_PASSWORD', { file: true });
const dbName = getEnv('POSTGRES_DB', { fallback: 'myapp' });
```

### Complete configuration example

```typescript
const config = {
  port: parseInt(getEnv('PORT', { fallback: '3000' })),
  database: {
    host: getEnv('DB_HOST'),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD', { file: true }),
    name: getEnv('DB_NAME', { fallback: 'production' })
  },
  jwt: {
    secret: getEnv('JWT_SECRET', { file: true })
  }
};
```

## Error handling

The module throws an explicit error if a required variable is not found:

```typescript
try {
  const requiredVar = getEnv('REQUIRED_VAR');
} catch (error) {
  console.error('Missing variable:', error.message);
  // Output: Variable REQUIRED_VAR is not defined
}
```

## Resolution priority

1. Direct environment variable (`VARNAME`)
2. File content specified in `VARNAME_FILE` (if `file: true`)
3. Fallback value (if defined)
4. Error if no value found

## License

MIT

## Note

Unit tests were written by Claude.ai.
