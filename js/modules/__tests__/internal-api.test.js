/**
 * @jest-environment jsdom
 */

import { InternalApi } from '../internal-api';

function withMockedFetch(fn) {
  const mockFetch = jest.fn();
  const originalFetch = window.fetch;
  window.fetch = mockFetch;
  fn(mockFetch);
  window.fetch = originalFetch;
}

describe('InternalApi', () => {
  it.each`
    property    | method
    ${'get'}    | ${'GET'}
    ${'post'}   | ${'POST'}
    ${'delete'} | ${'DELETE'}
  `(
    '$property should invoke fetch with $method method',
    ({ property, method }) => {
      withMockedFetch((fetch) => {
        InternalApi[property]('some/path');
        expect(fetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ method: method }),
        );
      });
    },
  );

  it.each(['get', 'post', 'delete'])(
    'should add __amp_source_origin with the current host parameter to the query (%s)',
    (property) => {
      withMockedFetch((fetch) => {
        InternalApi[property]('some/path');
        expect(fetch.mock.calls[0][0]).toContain(
          '__amp_source_origin=http%3A%2F%2Flocalhost',
        );
      });
    },
  );

  it.each(['get', 'delete'])(
    'should add encoded parameters form param to the query  (%s)',
    (property) => {
      withMockedFetch((fetch) => {
        InternalApi[property]('some/path', {
          param1: 42,
          param2: 'str<!"🙏',
          param3: ['1', '2', '3'],
        });
        expect(fetch.mock.calls[0][0]).toContain(
          'param1=42&param2=str%3C%21%22%F0%9F%99%8F&param3=1%2C2%2C3',
        );
      });
    },
  );

  it('should add encoded parameters form param to the query  (post)', () => {
    withMockedFetch((fetch) => {
      InternalApi.post(
        'some/path',
        {},
        { param1: 42, param2: 'str<!"🙏', param3: ['1', '2', '3'] },
      );
      expect(fetch.mock.calls[0][0]).toContain(
        'param1=42&param2=str%3C%21%22%F0%9F%99%8F&param3=1%2C2%2C3',
      );
    });
  });

  it.each(['get', 'post', 'delete'])(
    'should make correct controller url (%s)',
    (property) => {
      withMockedFetch((fetch) => {
        InternalApi[property]('some/path');
        expect(
          fetch.mock.calls[0][0].startsWith('/internal-api/some/path?'),
        ).toBe(true);
      });
    },
  );

  it('should post data as a json string', () => {
    withMockedFetch((fetch) => {
      InternalApi.post('some/path', { prop: 42 });
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: '{"prop":42}',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });
  });
});
