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
                    req.session.userEmail = user.email;
                    req.session.country_code = user.geolocation.country_code;
                    req.session.country = user.geolocation.country;
                    req.session.city = user.geolocation.city;
                    req.session.userLanguagePref = user.languagePref;
                    req.session.userInterests = user.interests;
                    req.session.isAdmin = user.isAdmin;

                    return res.json({"redirect": "/"});
                }else{
                    return res.json({"error": "Wrong password."});
                }
            });
        }else{
            return res.json({"error": "Username doesn't exist."});
        }
    });
}