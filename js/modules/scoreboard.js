import {
  jsLoader,
  cssLoader,
} from '@brightsites/flow-core/lib/utils/fileLoaders';
import { containComponent } from '@brightsites/flow-core/lib/utils/queueScript';

export default () => {
  if (containComponent('scoreboard')) {
    cssLoader([
      '//secure.widget.cloud.opta.net/v3/css/v3.football.opta-widgets.css',
    ]);
    jsLoader(['//secure.widget.cloud.opta.net/v3/v3.opta-widgets.js'], () => {
      window.opta_settings = {
        subscription_id: '7c085cc69a4c1938bf69f73e42b1be98',
        language: 'en_GB',
        timezone: 'Europe/London',
      };
    });
  }
};
