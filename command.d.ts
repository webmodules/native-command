interface Command {
  execute(message: string): void;
  queryState(): boolean;
  queryEnabled(): boolean;
}
