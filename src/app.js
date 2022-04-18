const express = require('express')
const expressSession = require('express-session');
const path = require('path');
const crypto = require('crypto');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
require('./db/db')

const { app, server, io } = require('./server')
const socket = require('./utils/socket')
var sharedsession = require("express-socket.io-session");

let secret = crypto.randomBytes(20).toString('hex');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

var session = expressSession({
    secret: secret,
    resave: true,
    saveUninitialized: true
});

app.use(session);
io.use(sharedsession(session, {
    autoSave: true
}))
socket(io)

app.set('view engine', 'ejs');

app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 5000

const fortune = require('../fortune.js');

// Routes
const signupRoute = require('./routes/userModels.js');
const loginRoute = require('./routes/login.js');
const chatRoute = require('./routes/chat')

// User controls
const { storeUser, loginUser, deleteUser, logoutUser, reportUser } = require('./controllers/userController')

// Interests controls
const { appendInterest, deleteInterest } = require('./controllers/interestsController')

// Get client location control
const clientLocationController = require('./controllers/getClientLocation.js');

// Get language from user
const languageController = require('./controllers/set_language.js');

// Edit account controls
const editUserRoute = require('./routes/edit.js');
const { changePassword, changeEmail, changeLanguage } = require('./controllers/editUser.js');

// Room controls
const { connectToRoom } = require('./controllers/roomControllers')

// Middleware controls
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const passIfAuthenticated = require('./middleware/passIfAuthenticated.js');

global.loggedIn = null;
global.country_code = null;
global.country = null;
global.city = null;

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

// Home page routing
app.get('/', (req, res) => {
    res.set({ 'Access-control-Allow-Origin': '*' });
    if (req.session.userId) {
        res.render('pages/home', {
            fortune: fortune.getFortune(),
            userId: req.session.userId,
            userName: req.session.userName,
            loggedIn: loggedIn,
            country_code: req.session.country_code,
            country: req.session.country,
            city: req.session.city,
            rooms: req.session.rooms,
            isAdmin: req.session.isAdmin
        });
    } else {
        res.render('pages/home', { fortune: fortune.getFortune(), isAdmin: req.session.isAdmin });
    }
});

app.use("*", (req, res, next) => {
    country_code = req.session.country_code;
    country = req.session.country;
    city = req.session.city;
    next();
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
app.post('/sign_up', redirectIfAuthenticatedMiddleware, storeUser);

app.get('/signin', redirectIfAuthenticatedMiddleware, loginRoute);
app.post('/sign_in', redirectIfAuthenticatedMiddleware, loginUser);

app.post('/newRoomConnection', passIfAuthenticated, connectToRoom)
app.get('/chat/:id', passIfAuthenticated, chatRoute)

app.post('/get_location', passIfAuthenticated, clientLocationController);

app.post('/set_language', languageController);

app.get('/editUser', passIfAuthenticated, editUserRoute);
app.post('/edit_email', passIfAuthenticated, changeEmail);
app.post('/edit_password', passIfAuthenticated, changePassword);
app.post('/edit_language', passIfAuthenticated, changeLanguage);

app.post('/add_interest', passIfAuthenticated, appendInterest);
app.post('/delete_interest', passIfAuthenticated, deleteInterest);

app.post('/report/:room/:user', passIfAuthenticated, reportUser)

app.post('/delete_user', passIfAuthenticated, deleteUser);
app.get('/logout', logoutUser);

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

server.listen(port, () => {
    console.log("Express started on http://localhost:" + port)
    console.log("Press Ctrl-C to terminate.")
});