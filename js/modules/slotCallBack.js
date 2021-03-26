import * as stickyTopBanner from '../modules/stickyTopBanner';
import * as videoHeaderGutterWidths from '../modules/videoHeaderGutterWidths';

export const onRendered = (slot, size) => {
  stickyTopBanner.onRendered(slot, size);
};

export const onLoaded = (slot, size) => {
  videoHeaderGutterWidths.onLoaded(slot, size);
  stickyTopBanner.onLoaded(slot, size);
};
