import { isUUIDv4 } from '../util';
import { getCookie } from '../cookie';

import {
  COOKIE_GUID,
  COOKIE_GENERATED_GUEST_ID,
} from '../../../../constants/cookies';

// https://developer.permutive.com/page/the-permutive-javascript-sdk#identify-users
export function identifyUser() {
  const gigyaId = getCookie(COOKIE_GUID);
  const generatedGuestId = getCookie(COOKIE_GENERATED_GUEST_ID);
  const permutiveIds = [];

  if (gigyaId) {
    permutiveIds.push({
      id: gigyaId,
      tag: 'gigya',
    });
  } else if (generatedGuestId && isUUIDv4(generatedGuestId)) {
    permutiveIds.push({
      id: generatedGuestId,
      tag: 'publisherUserId',
    });
  }

  window.permutive.identify(permutiveIds);
}
