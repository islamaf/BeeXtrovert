const express = require('express');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const geoip = require('geoip-lite');

const app = express();
app.set('port', process.env.PORT || 5000);

const fortune = require('./fortune.js');

// Signup controls
const newUserController = require('./controllers/userModels.js');
const storeUserController = require('./controllers/storeUser.js');

// Singin controls
const loginController = require('./controllers/login.js');
const loginUserController = require('./controllers/loginUser.js');

// Logout control
const logoutController = require('./controllers/logout.js');

// Get client location control
const locationController = require('./controllers/getStarted.js');
const clientLocationController = require('./controllers/getClientLocation.js');

// Middleware controls
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/BeeXtrovert', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
    console.log("connection succeeded");
})

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(expressSession({
    secret: 'k*9monday7tuesday*end',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

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
        if(req.session.geoLocation != "null"){
            res.render('pages/home', {fortune: fortune.getFortune(), userId: req.session.userId, userName: req.session.userName, loggedIn: loggedIn, 
                                        isAdmin: req.session.isAdmin});
        }else{
            res.redirect('getstarted');
        }
    }else{
        res.render('pages/home', {fortune: fortune.getFortune(), isAdmin: req.session.isAdmin});
    }
});

// Admin panel functions
const User = require('./models/User.js');

AdminBro.registerAdapter(AdminBroMongoose)
const AdminBroOptions = {
  resources: [User],
}

const adminBro = new AdminBro(AdminBroOptions);
const router = AdminBroExpress.buildRouter(adminBro);
// Admin panel functions

app.get('/signup', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/sign_up', redirectIfAuthenticatedMiddleware, storeUserController);

app.get('/signin', redirectIfAuthenticatedMiddleware, loginController);
app.post('/sign_in', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/getstarted', clientLocationController);

app.get('/logout', logoutController);

app.use(adminBro.options.rootPath, authMiddleware, router);

// custom 404 page
app.use((req, res) => {
    res.status(404);
    res.render('pages/404');
});

// custom 500 page
app.use((req, res) => {
    res.status(500);
    res.render('pages/500');
});

app.listen(app.get('port'), () => {
    console.log("Express started on http://localhost:" + app.get('port') + "; press Ctrl-C to terminate.");
});