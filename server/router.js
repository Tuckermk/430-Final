const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getItems', mid.requiresLogin, controllers.Item.getItems);
  app.post('/update', mid.requiresLogin, controllers.Item.updateItem);
  app.post('/delete', mid.requiresLogin, controllers.Item.deleteItem);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Item.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Item.makeItem);

  app.get('/inventory', mid.requiresLogin, controllers.Item.inventoryPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.use((req, res) => {
    res.redirect('/');
  });
};

module.exports = router;
