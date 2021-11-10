const express = require('express');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const geoip = require('geoip-lite');
const crypto = require('crypto');

const app = express();
app.set('port', process.env.PORT || 5000);

const fortune = require('./fortune.js');

// Signup controls
const signupRoute = require('./routes/userModels.js');
const storeUserController = require('./controllers/storeUser.js');

// Singin controls
const loginRoute = require('./routes/login.js');
const loginUserController = require('./controllers/loginUser.js');

// Logout control
const logoutController = require('./controllers/logout.js');

// Get client location control
const locationController = require('./controllers/getStarted.js');
const clientLocationController = require('./controllers/getClientLocation.js');

// User account controls
const editUserRoute = require('./routes/edit.js');
const editUserController = require('./controllers/editUser.js');
const editUsernameController = editUserController.changeUsername;
const editEmailController = editUserController.changeEmail;
const editPasswordController = editUserController.changePassword;
const deleteUserController = require('./controllers/deleteUser.js');

// Middleware controls
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const passIfAuthenticated = require('./middleware/passIfAuthenticated.js');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/BeeXtrovert', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
    console.log("connection succeeded");
})

let secret = crypto.randomBytes(20).toString('hex');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(expressSession({
    secret: secret,
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));

global.loggedIn = null;
global.geoLocation = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    geoLocation = req.session.geoLocation;
    next();
});

// Home page routing
app.get('/', (req, res) => {
    res.set({'Access-control-Allow-Origin': '*'});
    console.log(req.session);
    if(req.session.userId){
        // if(req.session.geoLocation != "null"){
            res.render('pages/home', {fortune: fortune.getFortune(), userId: req.session.userId, userName: req.session.userName, loggedIn: loggedIn, 
                                    geoLocation: req.session.geoLocation, isAdmin: req.session.isAdmin});
        // }else{
        //     res.redirect('getstarted');
        // }
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

app.get('/signup', redirectIfAuthenticatedMiddleware, signupRoute);
app.post('/sign_up', redirectIfAuthenticatedMiddleware, storeUserController);

app.get('/signin', redirectIfAuthenticatedMiddleware, loginRoute);
app.post('/sign_in', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/getstarted', passIfAuthenticated, clientLocationController);

app.get('/editUser', passIfAuthenticated, editUserRoute);
app.post('/edit_username', passIfAuthenticated, editUsernameController);
app.post('/edit_email', passIfAuthenticated, editEmailController);
app.post('/edit_password', passIfAuthenticated, editPasswordController);
app.post('/delete_user', passIfAuthenticated, deleteUserController);

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