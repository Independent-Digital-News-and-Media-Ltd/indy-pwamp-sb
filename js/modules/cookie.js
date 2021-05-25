export const getCookie = (name, defaultValue = null) => {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  return parts.length === 2
    ? decodeURIComponent(parts.pop().split(';').shift())
    : defaultValue;
};

export const setCookie = (name, value, expireDays = false, expireHours = 1) => {
  let date = new Date();
  const expireTime =
    expireDays !== false
      ? expireDays * 24 * 60 * 60 * 1000
      : expireHours * 60 * 60 * 1000;
  date.setTime(date.getTime() + expireTime);

  const assignment = `${name}=${encodeURIComponent(value)}`;
  const expires = `expires=${date.toGMTString()}`;
  const path = 'path=/';
  document.cookie = [assignment, expires, path].join(';');
};

export const removeCookie = (name) => {
  const assignment = `${name}=null`;
  const expires = 'expires=' + new Date().toGMTString();
  const path = 'path=/';
  document.cookie = [assignment, expires, path].join(';');
};

export const hasCookie = function (name) {
  return getCookie(name) !== null;
};
