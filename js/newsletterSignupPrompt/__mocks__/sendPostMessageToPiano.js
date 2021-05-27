let _proxy = () => {};

export const __setup = (proxy) => {
  _proxy = proxy;
};

export const sendPostMessageToPiano = (
  iframeId,
  success = true,
  message = '',
) => {
  _proxy(iframeId, success, message);
};
