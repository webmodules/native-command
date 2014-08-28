/// <reference path="require.d.ts" />
/**
* Returns a `Range` instance from the given Window, Document, DOM
* Element or Selection instance.
*
* Defaults to index `0`, but you may specify another index if desired.
*
* @param {Window|Document|Element|Selection} doc - Window, Document, DOM element,
*   or Selection instance to get the current selection Range from.
* @return {Range} returns a Range instance, or `null` if there's no
*   current selection.
* @public
*/
declare function currentRange(doc: any, index?: number): Range;
export = currentRange;
