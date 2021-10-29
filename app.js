const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fortune = require('./fortune.js');

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

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 5000);

app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));

// Home page routing
app.get('/', (req, res) => {
    res.set({'Access-control-Allow-Origin': '*'});
    res.render('home', {fortune: fortune.getFortune()});
});

// Sign up page routing
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/sign_up', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    var data = {
        "username": username,
        "password": password,
        "email": email
    }

    const user_checker = db.collection('users').findOne({username: username}, (err, user) => {
       if(user) {
            console.log("User already exists!");
       }else{
            db.collection('users').insertOne(data, (err, collection) => {
                if(err) throw err;
                console.log("Record inserted successfully!");
            });
       }
    });

    return res.render('home', {fortune: fortune.getFortune()});
});

// Sign ing page routing
app.get('/signin', (req, res) => {
    res.render('signin');
});

app.post('/sign_in', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    var data = {
        "username": username,
        "password": password
    }

    const user_checker = db.collection('users').findOne({username: username, password: password}, (err, user) => {
        if(user) {
            console.log("Login successful!");
            return res.render('home', {fortune: fortune.getFortune()});
        }else{
            console.log("User does not exist, please sign up!");
            return res.render('signup');
        }
    });
});
   
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