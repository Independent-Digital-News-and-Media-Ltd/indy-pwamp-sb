import { breakPoints } from '../../../config/theme/Styles';
import { getWindowWidth } from './util';

const topBannerId = 'top_banner';
const stickyClass = 'sticky';
const stickyTimeout = 3000;

let hasRunOnce = false;

export const onRendered = ({ slot, size }) => {
  const slotId = slot.getSlotElementId();

  if (slotId !== topBannerId) {
    return;
  }

  const topBanner = document.getElementById(topBannerId);
  const isVideo = topBanner.dataset.isVideo === 'true';

  const height = (Array.isArray(size) && size.length > 1 && size[1]) || 0;

  topBanner.parentNode.parentNode.style.height = `${height}px`;

  if (hasRunOnce) {
    return;
  } else {
    hasRunOnce = true;
  }

  if (isVideo || !topBanner || getWindowWidth() < breakPoints.tablet) {
    return;
  }

  topBanner.classList.add(stickyClass);
};

export const onLoaded = ({ slot }) => {
  const slotId = slot.getSlotElementId();

  if (slotId !== topBannerId) {
    return;
  }

  const topBanner = document.getElementById(topBannerId);

  setTimeout(() => {
    topBanner.classList.remove(stickyClass);
  }, stickyTimeout);
};
