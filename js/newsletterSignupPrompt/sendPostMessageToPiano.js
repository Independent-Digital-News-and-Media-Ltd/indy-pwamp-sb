/*
 *  if we use want to communicate with Piano again, this should be moved to a shared utils folder
 */

export const sendPostMessageToPiano = (
  iframeId,
  success = true,
  error = '',
) => {
  const iframe = document.getElementById(iframeId);

  if (iframe) {
    iframe.contentWindow.postMessage(
      {
        piano: {
          success,
          error,
        },
      },
      '*',
    );
  }
};
