// Runtime environments
export enum NodeEnv {
  DEV = 'development',
  PROD = 'production',
}

// Logging levels
export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

// Environment variables, casting to correct type and setting default values for them.
export class Constants {
  // Node runtime environment
  static NODE_ENV: NodeEnv = (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV

  // Logging level
  static LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO

  // Port to run the server in
  static PORT: string = process.env.PORT ?? '8080'

  // CORS urls to allow
  static CORS_WHITELIST: string = process.env.CORS_WHITELIST ?? '*'

  static TOKEN_SECRET: string = process.env.TOKEN_SECRET ?? 'secret'

  static AWS_REGION: string = process.env.AWS_DEFAULT_REGION ?? 'us-east-1'

  static AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID ?? 'accessKey1'

  static AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY ?? 'verySecretKey1'

  static AWS_BUCKET_NAME: string = process.env.AWS_BUCKET_NAME ?? 'bucketName'
}
