export const criticalFoft = () => {
  if ('fonts' in document) {
    const fontFaceSet = document.fonts;
    fontFaceSet.ready.then(() => {
      const articleHeader = document.querySelector('#articleHeader');
      articleHeader?.classList.add('fonts-loaded');
    });
  }
};

(function () {
  criticalFoft();
})();
