import { subscribeNonLoggedInUser } from '../subscribeNonLoggedInUser';
import { ERROR_KEY_EXISTING_EMAIL, ERROR_KEY_UNKNOWN } from '../constants';
import { InternalApi } from '../../modules/internal-api';
import { __setup } from '../sendPostMessageToPiano';
import { __setup as __setUpDispatchCustomEvent } from '../../utils/tracking';
import { FORM_ERROR_MESSAGE_ALREADY_SIGNED_UP } from '../../../../constants/formErrorMessages';

jest.mock('../../modules/internal-api');
jest.mock('../sendPostMessageToPiano');
jest.mock('../../utils/tracking');

describe('subscribeNonLoggedInUser()', () => {
  const IFRAME_ID = 'iframe-id';
  const CAPTCHA_TOKEN = 'test-token';
  const USER_EMAIL = 'user-email';
  const TEST_NEWSLETTER = 'test-newsletter';

  let mockEvent;
  let mockPost;
  let mockSendPostMessageToPiano;
  let mockDispatchCustomEvent;

  beforeEach(() => {
    const mockGrecaptchaExecute = jest.fn();

    mockGrecaptchaExecute.mockReturnValue(CAPTCHA_TOKEN);
    global.grecaptcha = {
      execute: mockGrecaptchaExecute,
    };

    mockSendPostMessageToPiano = jest.fn();
    mockDispatchCustomEvent = jest.fn();

    __setup(mockSendPostMessageToPiano);
    __setUpDispatchCustomEvent(mockDispatchCustomEvent);
  });

  describe('when response from server is OK', () => {
    describe('when user has ticked the offers checkbox', () => {
      beforeEach(() => {
        mockEvent = {
          params: {
            email: USER_EMAIL,
            newsletter: TEST_NEWSLETTER,
            offer: true,
            iframeid: IFRAME_ID,
          },
        };

        mockPost = jest.fn();
        mockPost.mockReturnValueOnce(Promise.resolve({ ok: true }));

        InternalApi.post = mockPost;
      });

      it('should post newsletters to api', async () => {
        await subscribeNonLoggedInUser(mockEvent);

        expect(mockPost).toHaveBeenCalledWith(
          'newsletter-component/submit/lite',
          {
            newsletters: [TEST_NEWSLETTER, 'receiveIndyOffers'],
            grecaptcha_token: CAPTCHA_TOKEN,
            email: USER_EMAIL,
          },
        );
      });

      it('should post message to Piano with success flag', async () => {
        await subscribeNonLoggedInUser(mockEvent);
        expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
          IFRAME_ID,
          true,
          '',
        );
      });

      it('should dispatch custom event', async () => {
        await subscribeNonLoggedInUser(mockEvent);

        expect(mockDispatchCustomEvent).toHaveBeenCalledWith(
          'newsletter_lite_reg_signup',
          {
            newsletter: '',
          },
        );
      });
    });

    describe('when user has NOT ticked the offers checkbox', () => {
      beforeEach(() => {
        mockEvent = {
          params: {
            email: USER_EMAIL,
            newsletter: TEST_NEWSLETTER,
            offer: false,
            iframeid: IFRAME_ID,
          },
        };

        mockPost = jest.fn();
        mockPost.mockReturnValueOnce(Promise.resolve({ ok: true }));

        InternalApi.post = mockPost;
      });

      it('should post newsletters to api', async () => {
        await subscribeNonLoggedInUser(mockEvent);

        expect(mockPost).toHaveBeenCalledWith(
          'newsletter-component/submit/lite',
          {
            newsletters: [TEST_NEWSLETTER],
            grecaptcha_token: CAPTCHA_TOKEN,
            email: USER_EMAIL,
          },
        );
      });

      it('should post message to Piano with success flag', async () => {
        await subscribeNonLoggedInUser(mockEvent);
        expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
          IFRAME_ID,
          true,
          '',
        );
      });

      it('should dispatch custom event', async () => {
        await subscribeNonLoggedInUser(mockEvent);

        expect(mockDispatchCustomEvent).toHaveBeenCalledWith(
          'newsletter_lite_reg_signup',
          {
            newsletter: '',
          },
        );
      });
    });
  });

  describe('when response from server is NOT OK', () => {
    beforeEach(() => {
      mockEvent = {
        params: {
          email: USER_EMAIL,
          newsletter: TEST_NEWSLETTER,
          offer: false,
          iframeid: IFRAME_ID,
        },
      };

      mockPost = jest.fn();
      mockPost.mockReturnValueOnce(
        Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              message: FORM_ERROR_MESSAGE_ALREADY_SIGNED_UP,
            }),
        }),
      );

      InternalApi.post = mockPost;
    });

    it('should post message to Piano with error flag and error key', async () => {
      await subscribeNonLoggedInUser(mockEvent);
      expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
        IFRAME_ID,
        false,
        ERROR_KEY_EXISTING_EMAIL,
      );
    });

    it('should dispatch custom event', async () => {
      await subscribeNonLoggedInUser(mockEvent);

      expect(mockDispatchCustomEvent).toHaveBeenCalledWith(
        'newsletter_lite_reg_signup',
        { newsletter: '' },
      );
    });
  });

  describe('when error is thrown', () => {
    beforeEach(() => {
      mockEvent = {
        params: {
          iframeid: IFRAME_ID,
        },
      };

      mockPost = () => {
        throw new Error();
      };

      InternalApi.post = mockPost;
    });

    it('should post message to Piano with error flag and unknown error key', async () => {
      await subscribeNonLoggedInUser(mockEvent);
      expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
        IFRAME_ID,
        false,
        ERROR_KEY_UNKNOWN,
      );
    });

    it('should dispatch custom event', async () => {
      await subscribeNonLoggedInUser(mockEvent);

      expect(mockDispatchCustomEvent).toHaveBeenCalledWith(
        'newsletter_lite_reg_signup',
        { newsletter: '' },
      );
    });
  });
});
