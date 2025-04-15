// enumerates application's environments
export enum Environment {
  // eslint-disable-next-line no-unused-vars
  DEV = "dev",
  // eslint-disable-next-line no-unused-vars
  DEVELOPMENT = "development",
  // eslint-disable-next-line no-unused-vars
  TEST = "test",
  // eslint-disable-next-line no-unused-vars
  PREPROD = "preprod",
  // eslint-disable-next-line no-unused-vars
  PREPRODUCTION = "preproduction",
  // eslint-disable-next-line no-unused-vars
  PROD = "prod",
  // eslint-disable-next-line no-unused-vars
  PRODUCTION = "production",
}

/**
 * Application's config
 */
export type Config = {
  /**
   * Current environment
   */
  environment: Environment;
  /**
   * Server port
   */
  port: number;
  /**
   * AWS profile
   */
  awsProfile: string;
  /**
   * AWS region
   */
  awsRegion: string;
};
