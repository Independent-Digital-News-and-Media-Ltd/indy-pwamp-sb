const sessionKey = 'digitalData';

export const getDigitalData = () => {
  const value = sessionStorage.getItem(sessionKey) || '{}';
  return JSON.parse(value);
};

export const storeDigitalData = (data) => {
  const stored = getDigitalData();
  const merged = Object.assign({}, stored, data);
  const newValue = JSON.stringify(merged);
  sessionStorage.setItem(sessionKey, newValue);
};

export const getDigitalDataByKeys = (keys) => {
  const stored = getDigitalData();
  const obj = {};
  keys.map((key) => (obj[key] = stored[key]));
  return obj;
};

export const removeDigitalDataByKeys = (keys) => {
  const stored = getDigitalData();
  keys.map((key) => delete stored[key]);
  sessionStorage.setItem(sessionKey, JSON.stringify(stored));
};

export const clearDigitalData = () => {
  sessionStorage.removeItem(sessionKey);
};

export default () => {
  const dataKeys = [
    'subscription_length',
    'subscription_price',
    'subscription_package',
    'auto_refresh',
  ];

  const digitalData = window.digitalData || {};
  const extraData = getDigitalDataByKeys(dataKeys);

  window.digitalData = {
    ...digitalData,
    ...extraData,
  };
};
