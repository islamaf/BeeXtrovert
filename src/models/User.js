const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    geolocation: {
        country_code: {
            type: String,
            default: "null"
        },
        country: {
            type: String,
            default: "null"
        },
        city: {
            type: String,
            default: "null"
        }
    },
    languagePref:{
        type: String,
        default: "null"
    },
    interests: [
        String
    ],
    rooms: [{
        room_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        room_name: {
            type: String
        }
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
});

// export model
const User = mongoose.model('User',UserSchema);

// a document instance
var user_islam = new User({ 
    username: 'islam', 
    password: "islam", 
    email: "islam_9t9@yahoo.com", 
    gender: "male", 
    age: "18-22", 
    languagePref: "english",
    interests: ["music"],
    geolocation: {
        country_code: "ru",
        country: "russia",
        city: "moscow"
    },
    isAdmin:true });
var user_marvin = new User({ 
    username: 'marvin', 
    password: "marvin", 
    email: "marvinwidjaja159@gmail.com", 
    gender: "male", 
    age: "18-22",
    languagePref: "english",
    interests: ["music"],
    geolocation: {
        country_code: "ru",
        country: "russia",
        city: "moscow"
    }, 
    isAdmin:true });
var user_lordhomie = new User({ 
    username: 'Lordhomie', 
    password: "lordhomie", 
    email: "hamouda99@windowslive.com", 
    gender: "male", 
    age: "18-22", 
    languagePref: "english",
    interests: ["music"],
    geolocation: {
        country_code: "ru",
        country: "russia",
        city: "moscow"
    },
    isAdmin:true });

// save model to database
user_islam.save(function (err, book) {
  if (err) return console.error(err);
  console.log(book.name + " saved to bookstore collection.");
});

user_marvin.save(function (err, book) {
    if (err) return console.error(err);
    console.log(book.name + " saved to bookstore collection.");
});

user_lordhomie.save(function (err, book) {
if (err) return console.error(err);
console.log(book.name + " saved to bookstore collection.");
});

module.exports = User;
