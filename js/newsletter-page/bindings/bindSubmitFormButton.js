import { SUBMIT_BUTTON_ID } from '../constants';
import { postNewsletters } from '../postNewsletters';

export const bindSubmitFormButton = (state) => {
  const submitFormButton = document.getElementById(SUBMIT_BUTTON_ID);

  submitFormButton.addEventListener('click', () => {
    postNewsletters(state);
  });
};
