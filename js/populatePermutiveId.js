import { permutiveReady } from './modules/permutive';
import { InternalApi } from './utils/internalApi';
import { hasCookie, getCookie } from './modules/cookie';
import {
  COOKIE_AUTH,
  COOKIE_PERMUTIVE_ID_IN_GIGYA,
} from '../../constants/cookies';

function doesPermutiveIdSet() {
  const value = getCookie(COOKIE_PERMUTIVE_ID_IN_GIGYA);
  return (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    value !== 'undefined'
  );
}

export function populatePermutiveId() {
  if (!hasCookie(COOKIE_AUTH) || doesPermutiveIdSet()) {
    return;
  }

  permutiveReady((value) => {
    InternalApi.post('profile-update/set-permutive-id', {
      permutiveID: value,
    });
  });
}
