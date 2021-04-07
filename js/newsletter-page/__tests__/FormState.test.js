import { FormState, EMAIL_ERROR_MESSAGE } from '../FormState';

jest.mock('../utils/buildMessageText', () => ({
  buildMessageText: (num) => `test: ${num}`,
}));

jest.mock('../utils/buildSuccessMessageText', () => ({
  buildSuccessMessageText: (num) => `success error message: ${num}`,
}));

describe('FormState', () => {
  let state;

  beforeEach(() => {
    state = new FormState();
  });

  describe('startRequest()', () => {
    beforeEach(() => {
      state.data.newsletters = {
        selected: ['alpha', 'beta', 'gamma'],
        intransit: [],
      };

      state.startRequest();
    });

    it('should set submittingRequest to TRUE', () => {
      expect(state.data.submittingRequest).toBe(true);
    });

    it('should move newsletters from `selected` array to `intransit` array', () => {
      expect(state.data.newsletters.selected).toEqual([]);
      expect(state.data.newsletters.intransit).toEqual([
        'alpha',
        'beta',
        'gamma',
      ]);
    });
  });

  describe('onSuccess()', () => {
    beforeEach(() => {
      state.data.newsletters = {
        intransit: ['alpha', 'beta', 'gamma'],
        subscribed: ['zeta'],
        selected: [],
      };

      state.onSuccess();
    });

    it('should add newsletters in `intransit` array to `subscribed` array', () => {
      expect(state.data.newsletters.subscribed).toEqual([
        'zeta',
        'alpha',
        'beta',
        'gamma',
      ]);
    });

    it('should empty `intransit` array', () => {
      expect(state.data.newsletters.intransit).toEqual([]);
    });

    it('should close input widget when no newsletters are selected', () => {
      expect(state.data.showInputWidget).toBe(false);
    });

    it('should set success message', () => {
      expect(state.data.successMessage).toBe('success error message: 3');
    });
  });

  describe('onSuccess() when `selected` array is NOT empty', () => {
    it('should NOT close input widget', () => {
      state.data.newsletters = {
        intransit: ['alpha'],
        subscribed: [],
        selected: ['epsilon'],
      };

      state.onSuccess();

      expect(state.data.showInputWidget).toBe(true);
    });
  });

  describe('onError()', () => {
    const ERROR_MESSAGE = 'error-message';

    beforeEach(() => {
      state.data.newsletters = {
        selected: ['alpha', 'beta'],
        intransit: ['gamma', 'delta', 'epsilon'],
      };

      state.onError(ERROR_MESSAGE);
    });

    it('should set error message', () => {
      expect(state.data.errorMessage).toEqual(ERROR_MESSAGE);
    });

    it('should mark all intransit newsletters as selected', () => {
      expect(state.data.newsletters.selected).toEqual([
        'alpha',
        'beta',
        'gamma',
        'delta',
        'epsilon',
      ]);
    });

    it('should empty intransit array', () => {
      expect(state.data.newsletters.intransit).toEqual([]);
    });

    it('should reset button text', () => {
      expect(state.data.buttonText).toBe('test: 5');
    });
  });

  describe('endRequest()', () => {
    beforeEach(() => {
      state.data = {
        submittingRequest: true,
      };

      state.endRequest();
    });

    it('should set submittingRequest to false', () => {
      expect(state.data.submittingRequest).toBe(false);
    });
  });

  describe('updateSelectedNewsletters()', () => {
    describe('when email is valid', () => {
      describe('when newsletter is selected', () => {
        beforeEach(() => {
          state.data = {
            email: {
              valid: true,
            },
            newsletters: {
              selected: ['alpha', 'beta'],
            },
          };

          state.updateSelectedNewsletters('gamma', true);
        });

        it('should add newsletter to `selected` array', () => {
          expect(state.data.newsletters.selected).toEqual([
            'alpha',
            'beta',
            'gamma',
          ]);
        });

        it('should set form as valid', () => {
          expect(state.data.valid).toBe(true);
        });

        it('should NOT close Input Widget', () => {
          expect(state.data.showInputWidget).toBe(true);
        });
      });

      describe('when newsletter is NOT selected', () => {
        describe('when there is more than 1 newsletter selected', () => {
          beforeEach(() => {
            state.data = {
              email: {
                valid: true,
              },
              newsletters: {
                selected: ['alpha', 'beta', 'gamma'],
              },
            };

            state.updateSelectedNewsletters('beta', false);
          });

          it('should remove newsletter from `selected` array', () => {
            expect(state.data.newsletters.selected).toEqual(['alpha', 'gamma']);
          });

          it('should set form as valid', () => {
            expect(state.data.valid).toBe(true);
          });

          it('should NOT close Input Widget', () => {
            expect(state.data.showInputWidget).toBe(true);
          });
        });

        describe('when there is only 1 newsletter selected', () => {
          beforeEach(() => {
            state.data = {
              email: {
                valid: true,
              },
              newsletters: {
                selected: ['beta'],
              },
            };

            state.updateSelectedNewsletters('beta', false);
          });

          it('should remove newsletter from `selected` array leaving it empty', () => {
            expect(state.data.newsletters.selected).toEqual([]);
          });

          it('should set form as NOT valid', () => {
            expect(state.data.valid).toBe(false);
          });

          it('should close Input Widget', () => {
            expect(state.data.showInputWidget).toBe(false);
          });
        });
      });
    });
    describe('when email is NOT valid', () => {
      describe('when newsletter is selected', () => {
        beforeEach(() => {
          state.data = {
            email: {
              valid: false,
            },
            newsletters: {
              selected: ['alpha', 'beta'],
            },
          };

          state.updateSelectedNewsletters('gamma', true);
        });

        it('should add newsletter to `selected` array', () => {
          expect(state.data.newsletters.selected).toEqual([
            'alpha',
            'beta',
            'gamma',
          ]);
        });

        it('should set form as NOT valid', () => {
          expect(state.data.valid).toBe(false);
        });

        it('should NOT close Input Widget', () => {
          expect(state.data.showInputWidget).toBe(true);
        });
      });

      describe('when newsletter is NOT selected', () => {
        describe('when there is more than 1 newsletter selected', () => {
          beforeEach(() => {
            state.data = {
              email: {
                valid: false,
              },
              newsletters: {
                selected: ['alpha', 'beta', 'gamma'],
              },
            };

            state.updateSelectedNewsletters('beta', false);
          });

          it('should remove newsletter from `selected` array', () => {
            expect(state.data.newsletters.selected).toEqual(['alpha', 'gamma']);
          });

          it('should set form as NOT valid', () => {
            expect(state.data.valid).toBe(false);
          });

          it('should NOT close Input Widget', () => {
            expect(state.data.showInputWidget).toBe(true);
          });
        });

        describe('when there is only 1 newsletter selected', () => {
          beforeEach(() => {
            state.data = {
              email: {
                valid: false,
              },
              newsletters: {
                selected: ['beta'],
              },
            };

            state.updateSelectedNewsletters('beta', false);
          });

          it('should remove newsletter from `selected` array leaving it empty', () => {
            expect(state.data.newsletters.selected).toEqual([]);
          });

          it('should set form as NOT valid', () => {
            expect(state.data.valid).toBe(false);
          });

          it('should close Input Widget', () => {
            expect(state.data.showInputWidget).toBe(false);
          });
        });
      });
    });
  });

  describe('markEmailFieldTouched()', () => {
    beforeEach(() => {
      state.data.email = {
        touched: false,
      };

      state.markEmailFieldTouched();
    });

    it('should mark email field as touched', () => {
      expect(state.data.email.touched).toBe(true);
    });
  });

  describe('markEmailFieldDirty()', () => {
    describe('when email is valid', () => {
      beforeEach(() => {
        state.data = {
          errorMessage: 'blah',
          email: {
            dirty: false,
            valid: true,
          },
        };

        state.markEmailFieldDirty();
      });

      it('should mark email field as dirty', () => {
        expect(state.data.email.dirty).toBe(true);
      });

      it('should set error message to empty', () => {
        expect(state.data.errorMessage).toBe('');
      });
    });

    describe('when email is NOT valid', () => {
      beforeEach(() => {
        state.data = {
          errorMessage: '',
          email: {
            dirty: false,
            valid: false,
          },
        };

        state.markEmailFieldDirty();
      });

      it('should mark email field as dirty', () => {
        expect(state.data.email.dirty).toBe(true);
      });

      it('should set error message', () => {
        expect(state.data.errorMessage).toBe(EMAIL_ERROR_MESSAGE);
      });
    });
  });

  describe('setEmail()', () => {
    describe('when email is valid', () => {
      describe('when there are no selected newsletters', () => {
        beforeEach(() => {
          state.data = {
            newsletters: {
              selected: [],
            },
            email: {
              value: '',
            },
          };

          state.setEmail('rich@indy.com', true);
        });

        it('should set email', () => {
          expect(state.data.email.value).toBe('rich@indy.com');
        });

        it('should set form as NOT valid', () => {
          expect(state.data.valid).toBe(false);
        });

        it('should set error message to empty string', () => {
          expect(state.data.errorMessage).toBe('');
        });
      });

      describe('when there are selected newsletters', () => {
        beforeEach(() => {
          state.data = {
            newsletters: {
              selected: ['alpha'],
            },
            email: {
              value: '',
            },
          };

          state.setEmail('rich@indy.com', true);
        });

        it('should set email', () => {
          expect(state.data.email.value).toBe('rich@indy.com');
        });

        it('should set form as valid', () => {
          expect(state.data.valid).toBe(true);
        });

        it('should set error message to empty string', () => {
          expect(state.data.errorMessage).toBe('');
        });
      });
    });

    describe('when email is NOT valid and field is pristine', () => {
      beforeEach(() => {
        state.data = {
          newsletters: {
            selected: ['alpha'],
          },
          email: {
            value: '',
            dirty: false,
          },
        };

        state.setEmail('rich@indy.com', false);
      });

      it('should set email', () => {
        expect(state.data.email.value).toBe('rich@indy.com');
      });

      it('should set form as NOT valid', () => {
        expect(state.data.valid).toBe(false);
      });

      it('should set error message to empty string', () => {
        expect(state.data.errorMessage).toBe('');
      });
    });

    describe('when email is NOT valid and field is dirty', () => {
      it('should set error message', () => {
        state.data = {
          newsletters: {
            selected: ['alpha'],
          },
          email: {
            value: '',
            dirty: true,
          },
        };

        state.setEmail('rich@indy.com', false);

        expect(state.data.errorMessage).toBe(EMAIL_ERROR_MESSAGE);
      });
    });
  });
});
