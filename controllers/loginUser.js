const User = require('../models/User.js');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {
    const usernameEmail = req.body.usernameEmail;
    const password = req.body.password;
    
    User.findOne({$or: [{username:usernameEmail}, {email:usernameEmail.toLowerCase()}]}, (err, user) => {
        if(user){
            bcrypt.compare(password, user.password, (err, same) => {
                if(same){
                    req.session.userId = user._id;
                    req.session.userName = user.username;
                    req.session.geoLocation = user.geolocation;
                    req.session.isAdmin = user.isAdmin;
                    // res.redirect('/');
                    res.json({"redirect": "/"});
                }else{
                    res.json({"error": "Wrong password."});
                    return;
                }
            });
        }else{
            res.json({"error": "Username doesn't exist."});
            return;
        }
    });
}