import { SUBMIT_BUTTON_ID } from '../constants';

export const watchSubmittingRequest = (state) => {
  const submitFormButton = document.getElementById(SUBMIT_BUTTON_ID);

  state.watch(
    (data) => data.submittingRequest,
    (submittingRequest) => {
      if (submittingRequest) {
        submitFormButton.classList.add('is-loading');
      } else {
        submitFormButton.classList.remove('is-loading');
      }
    },
  );
};
