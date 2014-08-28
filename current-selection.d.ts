/// <reference path="require.d.ts" />
/**
* Returns a `Selection` instance from the given Window, Document, DOM
* Element or Selection instance.
*
* @param {Window|Document|Element|Selection} doc - Window, Document or DOM Element
*   instance to get the current Selection from. If a Selection instance is passed
*   in, then it gets returned directly.
* @return {Selection} returns a Selection instance, or `null` if there is
*   no current selection.
* @public
*/
declare function currentSelection(doc: any): Selection;
export = currentSelection;
