export default () => {
  window.zESettings = {
    webWidget: {
      zIndex: 10,
    },
  };
  const webWidgetThemeColor = document.querySelector('[data-widget-color]');
  if (webWidgetThemeColor) {
    window.zESettings = {
      webWidget: {
        color: {
          theme: webWidgetThemeColor.getAttribute('data-widget-color'),
          zIndex: 10,
        },
      },
    };
  }
};
