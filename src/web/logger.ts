import {
  ExtensionContext,
  OutputChannel,
  Uri,
  window,
  workspace,
} from "vscode";

export type TraceLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogPayload = Partial<{
  ctx: string;
  msg: string;
  error?: Error;
}>;

export class Logger {

  static output: OutputChannel | undefined;
  private static _level: TraceLevel = "info";

  static get level() {
    return this._level;
  }

  static set level(value: TraceLevel) {
    this._level = value;
    this.output =
      this.output || window.createOutputChannel("otel-validator", "json");
  }

  static configure(context: ExtensionContext, level: TraceLevel) {
    this.level = level;
    // TODO
    this.output?.show();
  }

  static log = (
    payload: LogPayload,
    lvl: TraceLevel,
    _opts?: { show?: boolean }
  ) => {
      let stringMsg: string;
      if (!Logger.output) {
        return;
      }

      if (typeof payload === 'string') {
        stringMsg = payload;
      } else {
        stringMsg = customStringify(payload);
      }

      Logger.output.appendLine(lvl + ": " + stringMsg);
  }

}

const customStringify = function (v: any) {
  const cache = new Set();
  return JSON.stringify(v, (_key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        // Circular reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (err) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our set
      cache.add(value);
    }
    return value;
  });
};