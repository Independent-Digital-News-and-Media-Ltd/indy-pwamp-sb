import { jsLoader } from '@brightsites/flow-core/lib/utils/fileLoaders';
import moat, { delayForMoatTargeting } from '../moat';

jest.mock('@brightsites/flow-core/lib/utils/fileLoaders');
jest.useFakeTimers();

describe('moat', () => {
  it('calls jsloader', () => {
    moat();
    expect(jsLoader).toHaveBeenCalledTimes(1);
  });

  it('resolves timer', (done) => {
    delayForMoatTargeting().then((result) => {
      expect(result).toEqual('Done');
      done();
    });
    jest.runAllTimers();
  });

  it('resolves with moat callback', () => {
    const mockTargetingCall = jest.fn();
    window.moatPrebidApi = {
      setMoatTargetingForAllSlots: mockTargetingCall,
    };
    moat();
    window.moatYieldReady();
    expect(mockTargetingCall).toHaveBeenCalledTimes(1);
    expect(window.moatTargetingSet).toBeTruthy();
  });
});
