let _proxy = () => {};

export const __setup = (proxy) => {
  _proxy = proxy;
};

export const dispatchCustomEvent = (eventName, data) => {
  _proxy(eventName, data);
};
