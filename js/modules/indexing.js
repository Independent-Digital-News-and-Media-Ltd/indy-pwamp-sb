/*globals JSGlobals */
import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';

const { scriptUrl } = JSGlobals.indexExchange;

export default () => {
  jsLoader([scriptUrl]);
};
