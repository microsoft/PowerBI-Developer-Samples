/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
import * as service from './service';
import * as embed from './embed';
import * as models from 'powerbi-models';
/**
 * A Dashboard node within a dashboard hierarchy
 *
 * @export
 * @interface IDashboardNode
 */
export interface IDashboardNode {
    iframe: HTMLIFrameElement;
    service: service.IService;
    config: embed.IInternalEmbedConfiguration;
}
/**
 * A Power BI Dashboard embed component
 *
 * @export
 * @class Dashboard
 * @extends {embed.Embed}
 * @implements {IDashboardNode}
 * @implements {IFilterable}
 */
export declare class Dashboard extends embed.Embed implements IDashboardNode {
    static allowedEvents: string[];
    static dashboardIdAttribute: string;
    static typeAttribute: string;
    static type: string;
    /**
     * Creates an instance of a Power BI Dashboard.
     *
     * @param {service.Service} service
     * @param {HTMLElement} element
     */
    constructor(service: service.Service, element: HTMLElement, config: embed.IEmbedConfiguration);
    /**
     * This adds backwards compatibility for older config which used the dashboardId query param to specify dashboard id.
     * E.g. https://powerbi-df.analysis-df.windows.net/dashboardEmbedHost?dashboardId=e9363c62-edb6-4eac-92d3-2199c5ca2a9e
     *
     * By extracting the id we can ensure id is always explicitly provided as part of the load configuration.
     *
     * @static
     * @param {string} url
     * @returns {string}
     */
    static findIdFromEmbedUrl(url: string): string;
    /**
     * Get dashboard id from first available location: options, attribute, embed url.
     *
     * @returns {string}
     */
    getId(): string;
    /**
     * Validate load configuration.
     */
    validate(config: models.IDashboardLoadConfiguration): models.IError[];
    /**
     * Validate that pageView has a legal value: if page view is defined it must have one of the values defined in models.PageView
     */
    private ValidatePageView(pageView);
}
