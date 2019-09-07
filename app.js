if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  webPush = require('web-push'),
  port = process.env.PORT || 3000,
  Routes = require('./routes'),
  app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser(process.env.cookieKey));
app.use(express.static('public'));
app.use(express.static('service'));

webPush.setVapidDetails('mailto:test@test.com', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

// Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

// Routes
app.use('/api/todos', Routes.Todos);

app.listen(port, () => console.log(`Todo app started on port ${port}`))