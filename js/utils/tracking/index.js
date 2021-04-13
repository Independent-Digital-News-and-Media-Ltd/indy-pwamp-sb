import { prettyLog } from './prettyLog';

export const createCustomEvent = (name, eventData) => {
  prettyLog(name, eventData);
  return new CustomEvent(name, eventData);
};

export const dispatch = (event) => {
  document.body.dispatchEvent(event);
};

export const dispatchCustomEvent = (eventName, data) =>
  dispatch(
    createCustomEvent(eventName, {
      detail: { ...data },
    }),
  );
