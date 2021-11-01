const User = require('../models/User.js');
const path = require('path');

module.exports = (req, res) => {
    const email = req.body.email;

    User.findOne({email:email}, (err, duplicate) => {
        if(duplicate){
            // If email is already registered
            console.log("Email already in use!");
            res.redirect('pages/signup');
        }
        else {
            // If email was never registered before
            User.create(req.body, (err, user) => {
                if(err){
                    console.log(err);
                    return res.redirect('pages/signup');
                }
                
                res.redirect('/');
            });
        }
    });   
}