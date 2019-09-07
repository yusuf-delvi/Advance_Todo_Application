const DataBase = require('../models'),
  UserDb = DataBase.User,
  webPush = require('web-push'),
  cron = require('node-cron');

// ShowTodos
exports.showTodos = (req, res) => {
  let userid = req.signedCookies.advTodoUser;

  // Find user & send todos as JSON
  UserDb.findOne({
      _id: userid
    })
    .then(foundUser => {
      res.json(foundUser.todos)
    })
    .catch(err => res.json(err))
}

// CREATE TODO
exports.createTodo = (req, res) => {
  let userid = req.signedCookies.advTodoUser,
    bodyObj = req.body;

  UserDb.findOne({
      _id: userid
    })
    .then(foundUser => {
      foundUser.todos.push(bodyObj);
      foundUser.save()
        .then(savedUser => {
          let length = savedUser.todos.length - 1;
          let savedTodo = savedUser.todos[length];
          res.status(201).json(savedTodo);
          setRemind(savedTodo.reminder, userid, savedTodo._id)
        })
        .catch(err => res.json(err))
    })
}

// UPDATE TODO -- Completed
exports.updateTodo = (req, res) => {
  let userid = req.signedCookies.advTodoUser;

  UserDb.findOne({
      _id: userid
    })
    .then(foundUser => {
      let todo = foundUser.todos.id(req.body.todoId);
      if (todo.completed) {
        todo.completed = false
      } else {
        todo.completed = true
      }
      foundUser.save()
        .then(saveduser => res.json(todo))
        .catch(err => res.json(err))
    })
}

// DELETE TODO
exports.deleteTodo = (req, res) => {
  let userid = req.signedCookies.advTodoUser;

  UserDb.findOne({
      _id: userid
    })
    .then(foundUser => {
      foundUser.todos.remove({
        _id: req.body.todoId
      })
      foundUser.save()
        .then(savedUser => res.json('Todo Deleted Sucessfully'))
        .catch(err => res.json(err))
    })
}

// SUBSCRIBE SERVICEWORKER
exports.subscribeUser = (req, res) => {
  let userid = req.signedCookies.advTodoUser;

  UserDb.findOne({
      _id: userid
    })
    .then(foundUser => {
      foundUser.notifyKey = req.body.notifyKey;
      foundUser.save()
        .then(savedUser => res.status(201).json('Serviceworker registered & sent to DB'))
        .catch(err => res.json(err))
    })
}

// === === ===
function setRemind(r, user, todo) {
  if (r.hour !== '' && r.minute !== '') {
    if (r.dayOfMonth !== 'NaN' && r.month !== 'NaN' && r.dayOfWeek !== 'NaN') {
      let str = `${r.minute} ${r.hour} ${r.dayOfMonth} ${r.month} ${r.dayOfWeek}`;
      setCron(str, user, todo)
    }
  } else {
    if (r.dayOfMonth !== 'NaN' && r.month !== 'NaN' && r.dayOfWeek !== 'NaN') {
      let str = `0 10 ${r.dayOfMonth} ${r.month} ${r.dayOfWeek}`;
      setCron(str, user, todo)
    }
  }
}

function setCron(time, user, todo) {
  cron.schedule(time, () => {
    let userId = user;
    let todoId = todo;
    UserDb.findOne({
        _id: userId
      })
      .then(foundUser => {
        let todo = foundUser.todos.id(todoId);
        let notifyKey = JSON.parse(foundUser.notifyKey);

        if (todo !== null && todo.completed === false) {
          // Pass object into sendNotification
          let payload = JSON.stringify({
            title: "Hey, You have an Todo",
            options: {
              body: `Todo is: ${todo.name}`
            }
          });
          webPush
            .sendNotification(notifyKey, payload)
            .catch(err => console.error(err));
        }
      })
  })
}

// === === === === === === ===
//      Cookie MiddleWare
// === === === === === === ===
exports.cookieMiddleWare = (req, res, next) => {
  var cookie = req.signedCookies.advTodoUser,
    options = {
      maxAge: 999999999999,
      httpOnly: true,
      signed: true
    };

  if (cookie === undefined || cookie === null) {
    // If cookie is not present in browser
    // create user in Database
    UserDb.create({})
      .then(createdUser => {
        // create cookie & value as users id
        res.cookie('advTodoUser', createdUser._id, options);
        req.signedCookies.advTodoUser = createdUser._id;
        next();
      })
      .catch(err => console.error(err))
  } else {
    // If cookie is present in browser
    // find that user
    UserDb.findOne({
        _id: cookie
      })
      .then(foundUser => {
        // check if user is there or not
        if (foundUser === null) {
          // IF user is empty
          // Create user in Database
          UserDb.create({})
            .then(createdUser => {
              // create cookie & value as users id
              res.cookie('advTodoUser', createdUser._id, options);
              req.signedCookies.advTodoUser = createdUser._id;
              next();
            })
            .catch(err => console.error(err))
        } else {
          // Good to go:- cookie, user
          next()
        }
      })
  }
}

module.exports = exports;