const User = require('../models/User.js');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({username:username}, (err, user) => {
        if(user){
            bcrypt.compare(password, user.password, (err, same) => {
                if(same){
                    req.session.userId = user._id;
                    req.session.userName = user.username;
                    res.redirect('/');
                }else{
                    console.log(err);
                    res.redirect('signin');
                }
            });
        }else{
            res.redirect('signin');
        }
    });
}