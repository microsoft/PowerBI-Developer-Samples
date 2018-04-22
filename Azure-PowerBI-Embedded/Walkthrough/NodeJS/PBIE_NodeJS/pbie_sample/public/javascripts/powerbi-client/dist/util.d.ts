/*! powerbi-client v2.2.3 | (c) 2016 Microsoft Corporation MIT */
/**
 * Raises a custom event with event data on the specified HTML element.
 *
 * @export
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {*} eventData
 */
export declare function raiseCustomEvent(element: HTMLElement, eventName: string, eventData: any): void;
/**
 * Finds the index of the first value in an array that matches the specified predicate.
 *
 * @export
 * @template T
 * @param {(x: T) => boolean} predicate
 * @param {T[]} xs
 * @returns {number}
 */
export declare function findIndex<T>(predicate: (x: T) => boolean, xs: T[]): number;
/**
 * Finds the first value in an array that matches the specified predicate.
 *
 * @export
 * @template T
 * @param {(x: T) => boolean} predicate
 * @param {T[]} xs
 * @returns {T}
 */
export declare function find<T>(predicate: (x: T) => boolean, xs: T[]): T;
export declare function remove<T>(predicate: (x: T) => boolean, xs: T[]): void;
/**
 * Copies the values of all enumerable properties from one or more source objects to a target object, and returns the target object.
 *
 * @export
 * @param {any} args
 * @returns
 */
export declare function assign(...args: any[]): any;
/**
 * Generates a random 7 character string.
 *
 * @export
 * @returns {string}
 */
export declare function createRandomString(): string;
