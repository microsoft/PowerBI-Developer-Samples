/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
import * as service from './service';
import * as embed from './embed';
import * as models from 'powerbi-models';
import { IFilterable } from './ifilterable';
import { Page } from './page';
/**
 * A Report node within a report hierarchy
 *
 * @export
 * @interface IReportNode
 */
export interface IReportNode {
    iframe: HTMLIFrameElement;
    service: service.IService;
    config: embed.IInternalEmbedConfiguration;
}
/**
 * The Power BI Report embed component
 *
 * @export
 * @class Report
 * @extends {embed.Embed}
 * @implements {IReportNode}
 * @implements {IFilterable}
 */
export declare class Report extends embed.Embed implements IReportNode, IFilterable {
    static allowedEvents: string[];
    static reportIdAttribute: string;
    static filterPaneEnabledAttribute: string;
    static navContentPaneEnabledAttribute: string;
    static typeAttribute: string;
    static type: string;
    /**
     * Creates an instance of a Power BI Report.
     *
     * @param {service.Service} service
     * @param {HTMLElement} element
     * @param {embed.IEmbedConfiguration} config
     */
    constructor(service: service.Service, element: HTMLElement, config: embed.IEmbedConfiguration);
    /**
     * Adds backwards compatibility for the previous load configuration, which used the reportId query parameter to specify the report ID
     * (e.g. http://embedded.powerbi.com/appTokenReportEmbed?reportId=854846ed-2106-4dc2-bc58-eb77533bf2f1).
     *
     * By extracting the ID we can ensure that the ID is always explicitly provided as part of the load configuration.
     *
     * @static
     * @param {string} url
     * @returns {string}
     */
    static findIdFromEmbedUrl(url: string): string;
    /**
     * Gets filters that are applied at the report level.
     *
     * ```javascript
     * // Get filters applied at report level
     * report.getFilters()
     *   .then(filters => {
     *     ...
     *   });
     * ```
     *
     * @returns {Promise<models.IFilter[]>}
     */
    getFilters(): Promise<models.IFilter[]>;
    /**
     * Gets the report ID from the first available location: options, attribute, embed url.
     *
     * @returns {string}
     */
    getId(): string;
    /**
     * Gets the list of pages within the report.
     *
     * ```javascript
     * report.getPages()
     *  .then(pages => {
     *      ...
     *  });
     * ```
     *
     * @returns {Promise<Page[]>}
     */
    getPages(): Promise<Page[]>;
    /**
     * Creates an instance of a Page.
     *
     * Normally you would get Page objects by calling `report.getPages()`, but in the case
     * that the page name is known and you want to perform an action on a page without having to retrieve it
     * you can create it directly.
     *
     * Note: Because you are creating the page manually there is no guarantee that the page actually exists in the report, and subsequent requests could fail.
     *
     * ```javascript
     * const page = report.page('ReportSection1');
     * page.setActive();
     * ```
     *
     * @param {string} name
     * @param {string} [displayName]
     * @returns {Page}
     */
    page(name: string, displayName?: string): Page;
    /**
     * Prints the active page of the report by invoking `window.print()` on the embed iframe component.
     */
    print(): Promise<void>;
    /**
     * Removes all filters at the report level.
     *
     * ```javascript
     * report.removeFilters();
     * ```
     *
     * @returns {Promise<void>}
     */
    removeFilters(): Promise<void>;
    /**
     * Sets the active page of the report.
     *
     * ```javascript
     * report.setPage("page2")
     *  .catch(error => { ... });
     * ```
     *
     * @param {string} pageName
     * @returns {Promise<void>}
     */
    setPage(pageName: string): Promise<void>;
    /**
     * Sets filters at the report level.
     *
     * ```javascript
     * const filters: [
     *    ...
     * ];
     *
     * report.setFilters(filters)
     *  .catch(errors => {
     *    ...
     *  });
     * ```
     *
     * @param {(models.IFilter[])} filters
     * @returns {Promise<void>}
     */
    setFilters(filters: models.IFilter[]): Promise<void>;
    /**
     * Updates visibility settings for the filter pane and the page navigation pane.
     *
     * ```javascript
     * const newSettings = {
     *   navContentPaneEnabled: true,
     *   filterPaneEnabled: false
     * };
     *
     * report.updateSettings(newSettings)
     *   .catch(error => { ... });
     * ```
     *
     * @param {models.ISettings} settings
     * @returns {Promise<void>}
     */
    updateSettings(settings: models.ISettings): Promise<void>;
    /**
     * Validate load configuration.
     */
    validate(config: models.IReportLoadConfiguration): models.IError[];
}
