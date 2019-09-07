const express = require('express'),
  router = express.Router(),
  helper = require('../helpers/todo');

// widdleware -- check for cookie on every request
router.use(helper.cookieMiddleWare)

router.route('/')
  // SHOW Todos
  .get(helper.showTodos)

  // ADD Todo
  .post(helper.createTodo)

  // UPDATE Todo
  .put(helper.updateTodo)

  // DELETE Todo
  .delete(helper.deleteTodo)

router.route('/pushSubscription')
  .post(helper.subscribeUser)

module.exports = router;