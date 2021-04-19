import { subscribeLoggedInUser } from '../subscribeLoggedInUser';
import { InternalApi } from '../../modules/internal-api';
import { __setup } from '../sendPostMessageToPiano';
import { __setup as __setUpDispatchCustomEvent } from '../../utils/tracking';

jest.mock('../../modules/internal-api');
jest.mock('../sendPostMessageToPiano');
jest.mock('../../utils/tracking');

describe('subscribeLoggedInUser()', () => {
  const IFRAME_ID = 'iframe-id';
  const TEST_NEWSLETTER = 'test-newsletter';

  let mockEvent;
  let mockPost;
  let mockSendPostMessageToPiano;
  let mockDispatchCustomEvent;

  beforeEach(() => {
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
        await subscribeLoggedInUser(mockEvent);

        expect(mockPost).toHaveBeenCalledWith(
          'newsletter-component/logged-in/update',
          {
            [TEST_NEWSLETTER]: true,
            receiveIndyOffers: true,
          },
        );
      });

      it('should post message to Piano with success flag', async () => {
        await subscribeLoggedInUser(mockEvent);

        expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
          IFRAME_ID,
          true,
          '',
        );
      });

      it('should dispatch custom event', async () => {
        await subscribeLoggedInUser(mockEvent);

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
        await subscribeLoggedInUser(mockEvent);

        expect(mockPost).toHaveBeenCalledWith(
          'newsletter-component/logged-in/update',
          {
            [TEST_NEWSLETTER]: true,
          },
        );
      });

      it('should post message to Piano with success flag', async () => {
        await subscribeLoggedInUser(mockEvent);

        expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
          IFRAME_ID,
          true,
          '',
        );
      });

      it('should dispatch custom event', async () => {
        await subscribeLoggedInUser(mockEvent);

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
          iframeid: IFRAME_ID,
        },
      };

      mockPost = jest.fn();

      mockPost.mockReturnValueOnce(Promise.resolve({ ok: false }));

      InternalApi.post = mockPost;
    });

    it('should post message to Piano with error flag', async () => {
      await subscribeLoggedInUser(mockEvent);
      expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
        IFRAME_ID,
        false,
        '',
      );
    });

    it('should dispatch custom event', async () => {
      await subscribeLoggedInUser(mockEvent);

      expect(
        mockDispatchCustomEvent,
      ).toHaveBeenCalledWith('newsletter_lite_reg_signup', { newsletter: '' });
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

    it('should post message to Piano with error flag', async () => {
      await subscribeLoggedInUser(mockEvent);
      expect(mockSendPostMessageToPiano).toHaveBeenCalledWith(
        IFRAME_ID,
        false,
        '',
      );
    });

    it('should dispatch custom event', async () => {
      await subscribeLoggedInUser(mockEvent);

      expect(
        mockDispatchCustomEvent,
      ).toHaveBeenCalledWith('newsletter_lite_reg_signup', { newsletter: '' });
    });
  });
});
