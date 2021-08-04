import { Config } from ".";
declare const cognitoMiddleware: (config: Config) => (req: any, res: any, next: any) => any;
export { cognitoMiddleware };
