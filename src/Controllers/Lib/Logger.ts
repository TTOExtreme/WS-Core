import colors from 'ansi-colors';

class Logger {

    constructor() {

    }

    Log(...args: any[]) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), ...args);
    }
    Error(...args: any[]) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.red("[Error]"), ...args);
    }
    Info(...args: any[]) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.blueBright("[Info]"), ...args);
    }
    System(...args: any[]) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.yellow("[System]"), ...args);
    }

    _FormatTime() {
        return colors.green(new Date().getTime().toString());
    }
}

export { Logger }