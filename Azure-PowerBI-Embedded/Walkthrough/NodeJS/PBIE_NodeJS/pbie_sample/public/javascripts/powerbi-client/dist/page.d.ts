/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
import { IFilterable } from './ifilterable';
import { IReportNode } from './report';
import * as models from 'powerbi-models';
/**
 * A Page node within a report hierarchy
 *
 * @export
 * @interface IPageNode
 */
export interface IPageNode {
    report: IReportNode;
    name: string;
}
/**
 * A Power BI report page
 *
 * @export
 * @class Page
 * @implements {IPageNode}
 * @implements {IFilterable}
 */
export declare class Page implements IPageNode, IFilterable {
    /**
     * The parent Power BI report that this page is a member of
     *
     * @type {IReportNode}
     */
    report: IReportNode;
    /**
     * The report page name
     *
     * @type {string}
     */
    name: string;
    /**
     * The user defined display name of the report page, which is undefined if the page is created manually
     *
     * @type {string}
     */
    displayName: string;
    /**
     * Creates an instance of a Power BI report page.
     *
     * @param {IReportNode} report
     * @param {string} name
     * @param {string} [displayName]
     */
    constructor(report: IReportNode, name: string, displayName?: string);
    /**
     * Gets all page level filters within the report.
     *
     * ```javascript
     * page.getFilters()
     *  .then(pages => { ... });
     * ```
     *
     * @returns {(Promise<models.IFilter[]>)}
     */
    getFilters(): Promise<models.IFilter[]>;
    /**
     * Removes all filters from this page of the report.
     *
     * ```javascript
     * page.removeFilters();
     * ```
     *
     * @returns {Promise<void>}
     */
    removeFilters(): Promise<void>;
    /**
     * Makes the current page the active page of the report.
     *
     * ```javascripot
     * page.setActive();
     * ```
     *
     * @returns {Promise<void>}
     */
    setActive(): Promise<void>;
    /**
     * Sets all filters on the current page.
     *
     * ```javascript
     * page.setFilters(filters);
     *   .catch(errors => { ... });
     * ```
     *
     * @param {(models.IFilter[])} filters
     * @returns {Promise<void>}
     */
    setFilters(filters: models.IFilter[]): Promise<void>;
}
