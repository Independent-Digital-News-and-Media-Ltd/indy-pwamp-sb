/**
 * @jest-environment jsdom
 */

import { dispatchCustomEvent } from '../dispatchCustomEvent';

describe('dispatchCustomEvent', () => {
  const TEST_EVENT = 'test_event';
  let testListener;

  beforeEach(() => {
    testListener = jest.fn();
    document.body.addEventListener(TEST_EVENT, testListener);
  });

  afterEach(() => {
    document.body.removeEventListener(TEST_EVENT, testListener);
  });

  it('should fire event on document body', () => {
    dispatchCustomEvent(TEST_EVENT, {});

    expect(testListener).toHaveBeenCalled();
  });
});
