import { State } from '../state';

describe('State', () => {
  let state;
  let watchExpression1;
  let watchExpression2;
  let mockListener1;
  let mockListener2;

  const FIRST_FOO_VALUE = 'first-foo';
  const SECOND_FOO_VALUE = 'second-foo';
  const FIRST_BAR_VALUE = 'first-bar';

  beforeEach(() => {
    const initialState = {
      foo: FIRST_FOO_VALUE,
      bar: FIRST_BAR_VALUE,
    };

    state = new State(initialState);

    watchExpression1 = (data) => data.foo;
    watchExpression2 = (data) => data.bar;

    mockListener1 = jest.fn();
    mockListener2 = jest.fn();

    state.watch(watchExpression1, mockListener1);
    state.watch(watchExpression2, mockListener2);

    state.data.foo = SECOND_FOO_VALUE;

    state.digest();
  });

  it('should add watchers to watchers array', () => {
    expect(state.watchers.length).toBe(2);
  });

  describe('when watcher expression returns new value', () => {
    it('should call listener with new value', () => {
      expect(mockListener1.mock.calls.length).toBe(2);
      expect(mockListener1.mock.calls[0][0]).toBe(FIRST_FOO_VALUE);
      expect(mockListener1.mock.calls[0][1]).toBe(null);
      expect(mockListener1.mock.calls[1][0]).toBe(SECOND_FOO_VALUE);
      expect(mockListener1.mock.calls[1][1]).toBe(FIRST_FOO_VALUE);
    });
  });

  describe('when watcher expression does NOT return new value', () => {
    it('should NOT call listener', () => {
      // will be called just once when created rather than after digest()
      expect(mockListener2.mock.calls.length).toBe(1);
      expect(mockListener2.mock.calls[0][0]).toBe(FIRST_BAR_VALUE);
      expect(mockListener2.mock.calls[0][1]).toBe(null);
    });
  });
});
