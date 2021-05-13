import { loadJS } from './util';

export default () => {
  window._ml = window._ml || {};
  window._ml.eid = '85600';
  const cd = new Date();
  return loadJS([`https://ml314.com/tag.aspx?${cd.getDate()}${cd.getMonth()}`]);
};
