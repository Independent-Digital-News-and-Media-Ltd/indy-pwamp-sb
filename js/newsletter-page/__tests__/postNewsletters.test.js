import 'isomorphic-fetch';
import { FormState } from '../FormState';
import { postNewsletters, SERVER_ERROR_MESSAGE } from '../postNewsletters';

import { InternalApi } from '../../utils/internalApi';

jest.mock('../../utils/internalApi');

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
      const message = 'Some error from server';
      const body = JSON.stringify({ message });
      const init = { status: 400 };
      let mockPost;
      let mockOnError;

      beforeEach(async () => {
        let state = new FormState();
        mockPost = jest.fn();
        mockOnError = jest.fn();

        mockPost.mockReturnValue(Promise.resolve(new Response(body, init)));
        InternalApi.post = mockPost;

        state.submittingRequest = false;
        state.onError = mockOnError;
        state.endRequest = mockEndRequest;

        await postNewsletters(state);
      });

      it('should call `onError()` on state with message from server', () => {
        expect(mockOnError).toHaveBeenCalledWith(message);
      });

      it('should call `endRequest()`', () => {
        expect(mockEndRequest).toHaveBeenCalled();
      });
    });

    describe('when non 2XX response comes back from server without error message', () => {
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

      it('should call `onError()` on state with default error message', () => {
        expect(mockOnError).toHaveBeenCalledWith(SERVER_ERROR_MESSAGE);
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
