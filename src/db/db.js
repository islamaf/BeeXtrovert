const mongoose = require('mongoose')

const password = encodeURIComponent("taskapp");

// MongoDB connection
let dblink = `mongodb+srv://taskapp:${password}@cluster0.r7y0e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// mongoose.connect('mongodb://localhost:27017/BeeXtrovert', {
mongoose.connect(dblink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
    console.log("connection succeeded");
})