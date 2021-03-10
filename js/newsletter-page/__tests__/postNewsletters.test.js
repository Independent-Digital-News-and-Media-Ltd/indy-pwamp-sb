import { FormState } from '../FormState';
import { postNewsletters } from '../postNewsletters';

import { InternalApi } from '../../modules/internal-api';

jest.mock('../../modules/internal-api');

describe('postNewsletters()', () => {
  let mockGrecaptchaExecute;

  beforeEach(() => {
    jest.useFakeTimers();

    mockGrecaptchaExecute = jest.fn();

    mockGrecaptchaExecute.mockReturnValue('test_token');
    global.grecaptcha = {
      execute: mockGrecaptchaExecute,
    };
  });

  describe('when request is NOT being submitted', () => {
    let mockEndRequest;

    beforeEach(() => {
      mockEndRequest = jest.fn();
    });

    describe('when 2xx response comes back from server', () => {
      let mockHideSuccessMessage;
      let mockPost;

      beforeEach(async () => {
        let state = new FormState();

        mockPost = jest.fn();
        mockHideSuccessMessage = jest.fn();

        mockPost.mockReturnValue(Promise.resolve({ ok: true }));
        InternalApi.post = mockPost;

        state.submittingRequest = false;
        state.hideSuccessMessage = mockHideSuccessMessage;
        state.endRequest = mockEndRequest;

        await postNewsletters(state);
      });

      it('should post data to API', () => {
        expect(mockPost).toHaveBeenCalled();
      });

      it('should show hide success message after short period', () => {
        jest.runAllTimers();

        expect(mockHideSuccessMessage).toHaveBeenCalled();
      });

      it('should call `endRequest()`', () => {
        expect(mockEndRequest).toHaveBeenCalled();
      });
    });

    describe('when non 2XX response comes back from server', () => {
      let mockPost;
      let mockOnError;

      beforeEach(async () => {
        let state = new FormState();
        mockPost = jest.fn();
        mockOnError = jest.fn();

        mockPost.mockReturnValue(Promise.resolve({ ok: false }));
        InternalApi.post = mockPost;

        state.submittingRequest = false;
        state.onError = mockOnError;
        state.endRequest = mockEndRequest;

        await postNewsletters(state);
      });

      it('should call `onError()` on state', () => {
        expect(mockOnError).toHaveBeenCalled();
      });

      it('should call `endRequest()`', () => {
        expect(mockEndRequest).toHaveBeenCalled();
      });
    });
  });

  describe('when request is being submitted', () => {
    it('should NOT call post', async () => {
      let state = new FormState();
      state.submittingRequest = true;
      const mockPost = jest.fn();
      InternalApi.post = mockPost;
      await postNewsletters(state);
      expect(mockPost).not.toHaveBeenCalled();
    });
  });
});
