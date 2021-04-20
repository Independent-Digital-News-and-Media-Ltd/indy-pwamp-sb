export const criticalFoft = () => {
  if ('fonts' in document) {
    const fontFaceSet = document.fonts;
    fontFaceSet.onloadingdone = () => {};
    fontFaceSet.ready.then(() => {
      const articleHeader = document.querySelector('#articleHeader');
      articleHeader.className += ' fonts-loaded';
    });
  }
};

(function () {
  criticalFoft();
})();
