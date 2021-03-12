import { createPermutiveStub } from './createPermutiveStub';

// https://developer.permutive.com/page/the-permutive-javascript-sdk#callback-function
export function permutiveReady(subscriber) {
  createPermutiveStub();
  window.permutive.ready(() => {
    subscriber(window.permutive?.context?.user_id);
  });
}
