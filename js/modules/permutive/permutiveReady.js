import { createPermutiveStub } from './createPermutiveStub';

// https://developer.permutive.com/page/the-permutive-javascript-sdk#callback-function
export function permutiveReady(subscriber) {
  return new Promise((resolve) => {
    createPermutiveStub();
    window.permutive.ready(() => {
      const id = window.permutive?.context?.user_id;
      if (subscriber) {
        subscriber(id);
      }
      resolve(id);
    });
  });
}
