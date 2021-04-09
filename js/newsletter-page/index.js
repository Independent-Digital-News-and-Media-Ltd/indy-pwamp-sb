import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import { FormState } from './FormState';
import { bindEmailInputField } from './bindings/bindEmailInputField';
import { bindOffersCheckbox } from './bindings/bindOffersCheckbox';
import { bindSubmitFormButton } from './bindings/bindSubmitFormButton';
import { bindSuccessPopup } from './bindings/bindSuccessPopup';
import { watchButtonText } from './watchers/watchButtonText';
import { watchEmail } from './watchers/watchEmail';
import { watchErrorMessage } from './watchers/watchErrorMessage';
import { watchNewsletters } from './watchers/watchNewsletters';
import { watchShowInputWidget } from './watchers/watchShowInputWidget';
import { watchSubmittingRequest } from './watchers/watchSubmittingRequest';
import { watchSuccessMessage } from './watchers/watchSuccessMessage';
import { watchFormValidity } from './watchers/watchFormValidity';

function init() {
  const state = new FormState();

  bindEmailInputField(state);
  bindOffersCheckbox(state);
  bindSubmitFormButton(state);
  bindSuccessPopup(state);

  watchButtonText(state);
  watchEmail(state);
  watchErrorMessage(state);
  watchFormValidity(state);
  watchNewsletters(state);
  watchShowInputWidget(state);
  watchSubmittingRequest(state);
  watchSuccessMessage(state);
}

jsLoader(
  [
    'https://www.google.com/recaptcha/api.js?render=6LdQFKQUAAAAAALh9h5ypRL_GV19zbD4ZtAmj-pm',
  ],
  init,
);
