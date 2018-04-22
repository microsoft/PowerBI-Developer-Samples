/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
import * as models from 'powerbi-models';
import { Embed } from './embed';
/**
 * The Power BI tile embed component
 *
 * @export
 * @class Tile
 * @extends {Embed}
 */
export declare class Tile extends Embed {
    static type: string;
    /**
     * The ID of the tile
     *
     * @returns {string}
     */
    getId(): string;
    /**
     * Validate load configuration.
     */
    validate(config: any): models.IError[];
}
