/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import Command = require('command');
import currentRange = require('current-range');
import currentSelection = require('current-selection');

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
        sel = currentSelection(this.document);
        current = currentRange(sel);

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
      copyRange(range, currentRange(sel));

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
      sel = currentSelection(this.document);
      current = currentRange(sel);

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
    var current: Range = null;
    var sel: Selection = currentSelection(this.document);

    // set current document selection to given `range`
    if (range) {
      debug('setting document Selection to given Range %o', range);
      current = currentRange(sel);

      sel.removeAllRanges();
      sel.addRange(range);
    }

    debug('document.queryCommandEnabled(%o)', this.name);
    var enabled: boolean = sel.rangeCount > 0 && this.document.queryCommandEnabled(this.name);
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
}

function copyRange (source: Range, target: Range) {
  if (!target) return;
  source.setStart(target.startContainer, target.startOffset);
  source.setEnd(target.endContainer, target.endOffset);
}

export = NativeCommand;
