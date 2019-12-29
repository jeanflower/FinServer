

export function printDebug() {
  return false;
}

export function showObj(obj) {
  return JSON.stringify(obj, null, 4);
}

let doLog = true;
export function log(obj) {
  if (doLog) {
    /* eslint-disable no-console */ // all console calls routed through here
    // tslint:disable-next-line:no-console
    console.log(obj);
    /* eslint-enable no-console */
  }
}
export function suppressLogs() {
  doLog = false;
}
export function unSuppressLogs() {
  doLog = true;
}

