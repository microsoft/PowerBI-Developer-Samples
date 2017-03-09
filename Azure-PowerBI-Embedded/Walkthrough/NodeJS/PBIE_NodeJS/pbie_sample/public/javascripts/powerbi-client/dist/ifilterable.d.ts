/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
import * as models from 'powerbi-models';
/**
 * Decorates embed components that support filters
 * Examples include reports and pages
 *
 * @export
 * @interface IFilterable
 */
export interface IFilterable {
    /**
     * Gets the filters currently applied to the object.
     *
     * @returns {(Promise<models.IFilter[]>)}
     */
    getFilters(): Promise<models.IFilter[]>;
    /**
     * Replaces all filters on the current object with the specified filter values.
     *
     * @param {(models.IFilter[])} filters
     * @returns {Promise<void>}
     */
    setFilters(filters: models.IFilter[]): Promise<void>;
    /**
     * Removes all filters from the current object.
     *
     * @returns {Promise<void>}
     */
    removeFilters(): Promise<void>;
}
