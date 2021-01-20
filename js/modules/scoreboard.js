import { loadJS, loadCSS } from './util';
import { containComponent } from '@brightsites/flow-core/lib/utils/queueScript';

export default async () => {
  if (containComponent('scoreboard')) {
    await loadCSS([
      '//secure.widget.cloud.opta.net/v3/css/v3.football.opta-widgets.css',
    ]);

    await loadJS(['//secure.widget.cloud.opta.net/v3/v3.opta-widgets.js']);

    window.opta_settings = {
      subscription_id: '7c085cc69a4c1938bf69f73e42b1be98',
      language: 'en_GB',
      timezone: 'Europe/London',
    };
  }
};
