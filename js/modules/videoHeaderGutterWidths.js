const videoHeaderId = 'articleHeader';
const skinAdId = 'skin';

export const onLoaded = ({ slot, size }) => {
  const header = document.getElementById(videoHeaderId);
  if (header) {
    const slotId = slot.getSlotElementId();
    const adExists = size !== null || undefined;
    const isVideo = header.dataset.isVideo === 'true';
    if (slotId === skinAdId && isVideo && adExists) {
      const frameInner = document.getElementById('frameInner');
      header.style.marginRight = 'auto';
      header.style.marginLeft = 'auto';
      header.style.maxWidth = '1000px';
      frameInner.style.paddingTop = '0px';
    }

    if (slotId === skinAdId) {
      header.style.backgroundColor = 'transparent';
    }
  }
};
