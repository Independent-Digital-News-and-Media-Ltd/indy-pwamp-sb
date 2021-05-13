import { populatePermutiveId } from '../populatePermutiveId';
import { permutiveReady } from '../modules/permutive';
import { hasCookie, getCookie } from '../modules/cookie';
import { InternalApi } from '../modules/internal-api';

jest.mock('../modules/permutive');
jest.mock('../modules/internal-api');
jest.mock('../modules/cookie');

beforeEach(() => {
  permutiveReady.mockReset();
  InternalApi.post.mockReset();
});

function loginUser() {
  hasCookie.mockImplementationOnce((name) => {
    if (name === 'esi_auth') {
      return true;
    }
  });
}

function setEsiPermutiveIdCookie(value) {
  getCookie.mockImplementationOnce((name) => {
    if (name === 'esi_permutive_id_in_gigya') {
      return value;
    }
  });
}

describe('populatePermutiveId', () => {
  it('should not subscribe to permutiveId if user is not login', () => {
    hasCookie.mockImplementationOnce((name) => {
      if (name === 'esi_auth') {
        return false;
      }
    });
    populatePermutiveId();
    expect(permutiveReady).not.toHaveBeenCalled();
  });

  it('should not subscribe to permutiveId if user is login and has permutiveId', () => {
    loginUser();
    setEsiPermutiveIdCookie('some-guid');
    populatePermutiveId();
    expect(permutiveReady).not.toHaveBeenCalled();
  });

  it.each(['', undefined, null, 'undefined'])(
    'should subscribe to permutiveId if user is login and permutiveId is (%s)',
    (esiPermutiveIdValue) => {
      loginUser();
      setEsiPermutiveIdCookie(esiPermutiveIdValue);
      populatePermutiveId();
      expect(permutiveReady).toHaveBeenCalled();
    },
  );

  it('should call profile-update/set-permutive-id with permutive id value if user does not have permutive id', () => {
    loginUser();
    setEsiPermutiveIdCookie('');
    permutiveReady.mockImplementationOnce((subscriber) =>
      subscriber('some-guid'),
    );
    populatePermutiveId();
    expect(InternalApi.post).toHaveBeenCalledWith(
      'profile-update/set-permutive-id',
      {
        permutiveID: 'some-guid',
      },
    );
  });
});
