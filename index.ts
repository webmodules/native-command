///<reference path='command.d.ts' />

class NativeCommand implements Command {
  name: string;
  document: Document;

  constructor(name: string, doc?: Document) {
    this.name = name;
    this.document = doc || document; // default to global `document`
  }

  execute(value?: any) {
    this.document.execCommand(this.name, false, value || null);
  }

  queryState() {
    return this.document.queryCommandState(this.name);
  }

  queryEnabled() {
    return this.document.queryCommandEnabled(this.name);
  }

}

export = NativeCommand;
