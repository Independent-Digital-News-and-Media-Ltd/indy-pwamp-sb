// todo: should be global value that we use across the site
// eslint-disable-next-line
export const EMAIL_REGEX = /^(?=(.{1,64}@.{1,255}))([!#$%&amp;'*+\-\/=?\^_`{|}~a-zA-Z0-9}]{1,64}(\.[!#$%&amp;'*+\-\/=?\^_`{|}~a-zA-Z0-9]{0,}){0,})@((\[(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}\])|([a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{2,63}){1,}))$/;

export const isEmailValid = (email) => {
  return EMAIL_REGEX.test(email);
};
