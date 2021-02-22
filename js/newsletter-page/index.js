import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import { FormState } from './FormState';
import { bindUI } from './bindUI';

function init() {
  const state = new FormState();

  bindUI(state);
}

jsLoader(
  [
    'https://www.google.com/recaptcha/api.js?render=6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm',
  ],
  init,
);
