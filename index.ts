/// <reference path='command.d.ts' />

class NativeCommand implements Command {
  name: string;
  document: Document;

  constructor(name: string, doc?: Document) {
    this.name = name;
    this.document = doc || document; // default to global `document`
  }

  execute(range?: Range, value?: any): void {
    var sel: Selection = null;
    var current: Range = null;

    if (arguments.length >= 1) {
      if (range instanceof Range) {
        sel = this.getCurrentSelection();
        current = this.getCurrentRange(sel);

        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        value = range;
        range = null;
      }
    }

    this.document.execCommand(this.name, false, value || null);

    // restore original selection Range if necessary
    if (range) {
      sel.removeAllRanges();
      if (current) {
        sel.addRange(current);
      }
    }
  }

  queryState(range?: Range): boolean {
    var sel: Selection = null;
    var current: Range = null;

    // set current document selection to given `range`
    var sel: Selection = null;
    if (range) {
      sel = this.getCurrentSelection();
      current = this.getCurrentRange(sel);

      sel.removeAllRanges();
      sel.addRange(range);
    }

    var state: boolean = this.document.queryCommandState(this.name);

    // restore original selection Range if necessary
    if (range) {
      sel.removeAllRanges();
      if (current) {
        sel.addRange(current);
      }
    }

    return state;
  }

  queryEnabled(range?: Range): boolean {
    var sel: Selection = null;
    var current: Range = null;

    // set current document selection to given `range`
    var sel: Selection = null;
    if (range) {
      sel = this.getCurrentSelection();
      current = this.getCurrentRange(sel);

      sel.removeAllRanges();
      sel.addRange(range);
    }

    var enabled: boolean = this.document.queryCommandEnabled(this.name);

    // restore original selection Range if necessary
    if (range) {
      sel.removeAllRanges();
      if (current) {
        sel.addRange(current);
      }
    }

    return enabled;
  }

  private getCurrentSelection(): Selection {
    // TODO: use `get-window` here?
    var win = this.document.defaultView;
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
