/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import Command = require('./command');

/**
 * JavaScript dependencies.
 */

var debug = require('debug')('native-command');

/**
 * `NativeCommand` class that implements the `Command` interface on top of
 * the native `document.execCommand()`, `document.queryCommandState()`, and
 * `document.queryCommandEnabled()` functions.
 *
 * ``` js
 * var bold = new NativeCommand('bold', document);
 * bold.execute();
 * ```
 *
 * @public
 */

class NativeCommand implements Command {
  public name: string;
  public document: Document;

  constructor(name: string, doc?: Document) {
    this.name = name;
    this.document = doc || document; // default to global `document`
    debug('created NativeCommand: name %o, document %o', this.name, this.document);
  }

  execute(range?: Range, value?: any): void {
    var sel: Selection = null;
    var current: Range = null;

    if (arguments.length >= 1) {
      if (range instanceof Range) {
        debug('setting document Selection to given Range %o', range);
        sel = this.getCurrentSelection();
        current = this.getCurrentRange(sel);

        sel.removeAllRanges();
        sel.addRange(range);
      } else if (null != range) {
        value = range;
        range = null;
      }
    }

    if (!value) value = null;
    debug('document.execCommand(%o, %o, %o)', this.name, false, value);
    this.document.execCommand(this.name, false, value);

    // restore original selection Range if necessary
    if (range) {
      sel.removeAllRanges();
      if (current) {
        debug('restoring Selection to original Range %o', current);
        sel.addRange(current);
      }
    }
  }

  queryState(range?: Range): boolean {
    var sel: Selection = null;
    var current: Range = null;

    // set current document selection to given `range`
    if (range) {
      debug('setting document Selection to given Range %o', range);
      sel = this.getCurrentSelection();
      current = this.getCurrentRange(sel);

      sel.removeAllRanges();
      sel.addRange(range);
    }

    debug('document.queryCommandState(%o)', this.name);
    var state: boolean = this.document.queryCommandState(this.name);
    debug('  => %o', state);

    // restore original selection Range if necessary
    if (range) {
      sel.removeAllRanges();
      if (current) {
        debug('restoring Selection to original Range %o', current);
        sel.addRange(current);
      }
    }

    return state;
  }

  queryEnabled(range?: Range): boolean {
    var sel: Selection = null;
    var current: Range = null;

    // set current document selection to given `range`
    if (range) {
      debug('setting document Selection to given Range %o', range);
      sel = this.getCurrentSelection();
      current = this.getCurrentRange(sel);

      sel.removeAllRanges();
      sel.addRange(range);
    }

    debug('document.queryCommandEnabled(%o)', this.name);
    var enabled: boolean = this.document.queryCommandEnabled(this.name);
    debug('  => %o', enabled);

    // restore original selection Range if necessary
    if (range) {
      sel.removeAllRanges();
      if (current) {
        debug('restoring Selection to original Range %o', current);
        sel.addRange(current);
      }
    }

    return enabled;
  }

  private getCurrentSelection(): Selection {
    // TODO: use `get-window` here?
    var win: Window = this.document.defaultView;
    return win.getSelection();
  }

  private getCurrentRange(sel?: Selection, index?: number): Range {
    if (!sel) sel = this.getCurrentSelection();
    index |= 0;
    if (sel.rangeCount <= index) return null;
    return sel.getRangeAt(index);
  }
}

export = NativeCommand;
