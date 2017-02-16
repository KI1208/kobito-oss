export = subscriber;
declare var Mousetrap: any;
var buildMenu = require('../../utils/build-menu');

function subscriber(context, subscribe) {
  subscribe('context:started',  () => {
    Mousetrap.pause();
    buildMenu('login');
  });

  subscribe('context:disposed', () => Mousetrap.unpause());
  subscribe('context:paused',   () => Mousetrap.unpause());
  subscribe('login:finish-login-with-code', (code: string) => {
    var pkg = require('../../../package.json');
    app.track('login');

    Qiita.Resources.AccessToken.create_access_token({
      client_id: pkg.appId,
      client_secret: app.appSecret,
      code: code
    }).then(data => {
      var token = data.token;
      app.config.setAPIToken(token);
      (<any>Qiita).setToken(token);
      return kaita.commands.initialize.setupAtFirstLogin();
    })
    .then(() => {
      app.router.popContext();
    });
  });
}
