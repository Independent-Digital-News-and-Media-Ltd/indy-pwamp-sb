const frameId = 'frameInner';
const topBannerId = 'top_banner';

export default () => {
  if (document.body.classList.contains('wrapped_by_ads')) {
    const frame = document.getElementById(frameId);
    const topBanner = document.getElementById(topBannerId);
    frame.style.paddingTop = 0;
    topBanner.style.height = 0;
    topBanner.parentNode.parentNode.style.height = 0;
  }
};
