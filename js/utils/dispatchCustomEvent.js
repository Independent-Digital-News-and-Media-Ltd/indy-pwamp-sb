import { prettyLog } from './prettyLog';

const createCustomEvent = (name, eventData = {}) => {
  prettyLog(`CustomEvent: ${name}`, eventData.detail);
  return new CustomEvent(name, eventData);
};

const dispatch = (event) => {
  document.body.dispatchEvent(event);
};

export const dispatchCustomEvent = (eventName, data) =>
  dispatch(
    createCustomEvent(eventName, {
      detail: { ...data },
    }),
  );
