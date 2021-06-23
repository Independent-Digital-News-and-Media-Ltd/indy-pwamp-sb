/*globals JSGlobals */
import { loadJS } from './util';

const { scriptUrl } = JSGlobals.indexExchange;

export default async () => {
  await loadJS([scriptUrl]);
};
