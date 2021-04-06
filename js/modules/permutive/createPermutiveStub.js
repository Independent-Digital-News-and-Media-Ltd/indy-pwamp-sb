// https://developer.permutive.com/page/the-permutive-javascript-sdk#installation
export function createPermutiveStub() {
  const { projectId, apiKey } = window.JSGlobals.permutive;
  /* eslint-disable */
  !(function (n, e, o, r, i) {
    if (!e) {
      (e = e || {}),
        (window.permutive = e),
        (e.q = []),
        (e.config = i || {}),
        (e.config.projectId = o),
        (e.config.apiKey = r),
        (e.config.environment = e.config.environment || 'production');
      for (
        var t = [
            'addon',
            'identify',
            'track',
            'trigger',
            'query',
            'segment',
            'segments',
            'ready',
            'on',
            'once',
            'user',
            'consent',
          ],
          c = 0;
        c < t.length;
        c++
      ) {
        var f = t[c];
        e[f] = (function (n) {
          return function () {
            var o = Array.prototype.slice.call(arguments, 0);
            e.q.push({ functionName: n, arguments: o });
          };
        })(f);
      }
    }
  })(document, window.permutive, `${projectId}`, `${apiKey}`, {});
  /* eslint-enable */
}
