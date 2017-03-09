/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
/**
 * TODO: Need to find better place for these factory functions or refactor how we handle dependency injection
 */
import { IHpmFactory, IWpmpFactory, IRouterFactory } from './service';
export { IHpmFactory, IWpmpFactory, IRouterFactory };
export declare const hpmFactory: IHpmFactory;
export declare const wpmpFactory: IWpmpFactory;
export declare const routerFactory: IRouterFactory;
