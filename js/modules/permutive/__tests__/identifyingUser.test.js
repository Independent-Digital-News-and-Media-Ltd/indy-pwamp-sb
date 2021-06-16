/**
 * @jest-environment jsdom
 */

import { getCookie } from '../../cookie';
import { identifyUser } from '../identifyUser';

jest.mock('../../cookie');

beforeEach(() => {
  window.permutive = {
    identify: jest.fn(),
  };
  getCookie.mockReset();
});

afterEach(() => {
  delete window.permutive;
});

describe('identifyingUsers', function () {
  it('should set Gigya id for login user', () => {
    getCookie.mockImplementation((name) => {
      return {
        esi_guid: 'the-gigya-id',
        'esi-permutive-id': 'c5648c5b-6f5c-453e-98a1-b1b13f3e80b9',
      }[name];
    });
    identifyUser();
    expect(window.permutive.identify).toHaveBeenCalledWith([
      {
        id: 'the-gigya-id',
        tag: 'gigya',
      },
    ]);
  });

  it('should set generated id for guest', () => {
    getCookie.mockImplementation((name) => {
      return {
        esi_guid: null,
        'esi-permutive-id': 'c5648c5b-6f5c-453e-98a1-b1b13f3e80b9',
      }[name];
    });
    identifyUser();
    expect(window.permutive.identify).toHaveBeenCalledWith([
      {
        id: 'c5648c5b-6f5c-453e-98a1-b1b13f3e80b9',
        tag: 'publisherUserId',
      },
    ]);
  });

  it('should not set generated id for guest if it is not UID', () => {
    getCookie.mockImplementation((name) => {
      return {
        esi_guid: null,
        'esi-permutive-id': 'undefined',
      }[name];
    });
    identifyUser();
    expect(window.permutive.identify).toHaveBeenCalledWith([]);
  });
});
