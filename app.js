const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');

const fortune = require('./fortune.js');

// Signup controls
const newUserController = require('./controllers/userModels.js');
const storeUserController = require('./controllers/storeUser.js');

// Singin controls
const loginController = require('./controllers/login.js');
const loginUserController = require('./controllers/loginUser.js');

// Logout control
const logoutController = require('./controllers/logout.js');

// Middleware controls
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

mongoose.connect('mongodb://localhost:27017/BeeXtrovert', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
    console.log("connection succeeded");
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(expressSession({
    secret: 'k*9monday7tuesday*end'
}));

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 5000);

app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

// Home page routing
app.get('/', (req, res) => {
    res.set({'Access-control-Allow-Origin': '*'});
    console.log(req.session);
    if(req.session.userId){
        res.render('home', {fortune: fortune.getFortune(), userId: req.session.userId, userName: req.session.userName, loggedIn: loggedIn});
    }else{
        res.render('home', {fortune: fortune.getFortune()});
    }
});

app.get('/signup', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/sign_up', redirectIfAuthenticatedMiddleware, storeUserController);

app.get('/signin', redirectIfAuthenticatedMiddleware, loginController);
app.post('/sign_in', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/logout', logoutController);
   
// custom 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use((req, res) => {
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), () => {
    console.log("Express started on http://localhost:" + app.get('port') + "; press Ctrl-C to terminate.");
});