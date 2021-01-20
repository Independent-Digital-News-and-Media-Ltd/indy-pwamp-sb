import { log } from './log';

const timers = {};
let startTime;

const getElapsed = () => Date.now() - startTime;

export const init = () => {
  log('Start time recorded');
  startTime = Date.now();
};

export const start = (name) => {
  const start = getElapsed();
  timers[name] = start;
  log(`starting ${name} load @ ${start}`);
};

export const end = (name) => {
  const end = getElapsed();
  log(`finished ${name} load @ ${end}, duration ${end - timers[name]}`);
  delete timers[name];
};
