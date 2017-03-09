/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
import * as embed from './embed';
import { Report } from './report';
import { Dashboard } from './dashboard';
import { Tile } from './tile';
import * as wpmp from 'window-post-message-proxy';
import * as hpm from 'http-post-message';
import * as router from 'powerbi-router';
export interface IEvent<T> {
    type: string;
    id: string;
    name: string;
    value: T;
}
export interface ICustomEvent<T> extends CustomEvent {
    detail: T;
}
export interface IEventHandler<T> {
    (event: ICustomEvent<T>): any;
}
export interface IHpmFactory {
    (wpmp: wpmp.WindowPostMessageProxy, targetWindow?: Window, version?: string, type?: string, origin?: string): hpm.HttpPostMessage;
}
export interface IWpmpFactory {
    (name?: string, logMessages?: boolean, eventSourceOverrideWindow?: Window): wpmp.WindowPostMessageProxy;
}
export interface IRouterFactory {
    (wpmp: wpmp.WindowPostMessageProxy): router.Router;
}
export interface IPowerBiElement extends HTMLElement {
    powerBiEmbed: embed.Embed;
}
export interface IDebugOptions {
    logMessages?: boolean;
    wpmpName?: string;
}
export interface IServiceConfiguration extends IDebugOptions {
    autoEmbedOnContentLoaded?: boolean;
    onError?: (error: any) => any;
    version?: string;
    type?: string;
}
export interface IService {
    hpm: hpm.HttpPostMessage;
}
/**
 * The Power BI Service embed component, which is the entry point to embed all other Power BI components into your application
 *
 * @export
 * @class Service
 * @implements {IService}
 */
export declare class Service implements IService {
    /**
     * A list of components that this service can embed
     */
    private static components;
    /**
     * The default configuration for the service
     */
    private static defaultConfig;
    /**
     * Gets or sets the access token as the global fallback token to use when a local token is not provided for a report or tile.
     *
     * @type {string}
     */
    accessToken: string;
    /**The Configuration object for the service*/
    private config;
    /** A list of Dashboard, Report and Tile components that have been embedded using this service instance. */
    private embeds;
    /** TODO: Look for way to make hpm private without sacraficing ease of maitenance. This should be private but in embed needs to call methods. */
    hpm: hpm.HttpPostMessage;
    /** TODO: Look for way to make wpmp private.  This is only public to allow stopping the wpmp in tests */
    wpmp: wpmp.WindowPostMessageProxy;
    private router;
    /**
     * Creates an instance of a Power BI Service.
     *
     * @param {IHpmFactory} hpmFactory The http post message factory used in the postMessage communication layer
     * @param {IWpmpFactory} wpmpFactory The window post message factory used in the postMessage communication layer
     * @param {IRouterFactory} routerFactory The router factory used in the postMessage communication layer
     * @param {IServiceConfiguration} [config={}]
     */
    constructor(hpmFactory: IHpmFactory, wpmpFactory: IWpmpFactory, routerFactory: IRouterFactory, config?: IServiceConfiguration);
    /**
     * TODO: Add a description here
     *
     * @param {HTMLElement} [container]
     * @param {embed.IEmbedConfiguration} [config=undefined]
     * @returns {embed.Embed[]}
     */
    init(container?: HTMLElement, config?: embed.IEmbedConfiguration): embed.Embed[];
    /**
     * Given a configuration based on an HTML element,
     * if the component has already been created and attached to the element, reuses the component instance and existing iframe,
     * otherwise creates a new component instance.
     *
     * @param {HTMLElement} element
     * @param {embed.IEmbedConfiguration} [config={}]
     * @returns {embed.Embed}
     */
    embed(element: HTMLElement, config?: embed.IEmbedConfiguration): embed.Embed;
    /**
     * Given a configuration based on a Power BI element, saves the component instance that reference the element for later lookup.
     *
     * @private
     * @param {IPowerBiElement} element
     * @param {embed.IEmbedConfiguration} config
     * @returns {embed.Embed}
     */
    private embedNew(element, config);
    /**
     * Given an element that already contains an embed component, load with a new configuration.
     *
     * @private
     * @param {IPowerBiElement} element
     * @param {embed.IEmbedConfiguration} config
     * @returns {embed.Embed}
     */
    private embedExisting(element, config);
    /**
     * Adds an event handler for DOMContentLoaded, which searches the DOM for elements that have the 'powerbi-embed-url' attribute,
     * and automatically attempts to embed a powerbi component based on information from other powerbi-* attributes.
     *
     * Note: Only runs if `config.autoEmbedOnContentLoaded` is true when the service is created.
     * This handler is typically useful only for applications that are rendered on the server so that all required data is available when the handler is called.
     */
    enableAutoEmbed(): void;
    /**
     * Returns an instance of the component associated with the element.
     *
     * @param {HTMLElement} element
     * @returns {(Report | Tile)}
     */
    get(element: HTMLElement): Report | Tile | Dashboard;
    /**
     * Finds an embed instance by the name or unique ID that is provided.
     *
     * @param {string} uniqueId
     * @returns {(Report | Tile)}
     */
    find(uniqueId: string): Report | Tile | Dashboard;
    /**
     * Given an HTML element that has a component embedded within it, removes the component from the list of embedded components, removes the association between the element and the component, and removes the iframe.
     *
     * @param {HTMLElement} element
     * @returns {void}
     */
    reset(element: HTMLElement): void;
    /**
     * Given an event object, finds the embed component with the matching type and ID, and invokes its handleEvent method with the event object.
     *
     * @private
     * @param {IEvent<any>} event
     */
    private handleEvent(event);
}
