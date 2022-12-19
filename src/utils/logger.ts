export default class Logger {
  static log(...args: any[]) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  static warn(...args: any[]) {
    console.warn(...args);
  }

  static error(...args: any[]) {
    console.error(...args);
  }
}
