function callInternalApi(path, init, params = {}) {
  const query = new URLSearchParams();
  query.set('__amp_source_origin', window.location.origin);
  Object.keys(params).forEach((key) => {
    query.set(key, params[key]);
  });
  return fetch(`/internal-api/${path}?${query.toString()}`, init);
}

// see /app/routes/internalAPI.js
export const InternalApi = {
  post: (path, data, params) => {
    return callInternalApi(
      path,
      {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      params,
    );
  },
  get: (path, params) => {
    return callInternalApi(
      path,
      {
        method: 'GET',
      },
      params,
    );
  },
  delete: (path, params) => {
    return callInternalApi(
      path,
      {
        method: 'DELETE',
      },
      params,
    );
  },
};
