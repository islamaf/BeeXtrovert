const User = require('../models/User.js');
const path = require('path');

const emailValidator = require('email-validator');

module.exports = (req, res) => {
    const email = req.body.email.toLowerCase();

    const usernameFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/

    User.findOne({email:email}, (err, duplicate) => {
        if(duplicate){
            // If email is already registered
            res.json({"error": "Email already registered."});
            return;
        }
        else {
            // If email was never registered before
            if(emailValidator.validate(email)){
                if(usernameFormat.test(req.body.username)){
                    // If username contains errors
                    res.json({"error": "Username cannot contain symbols."});
                    return;
                }else if(passwordFormat.test(req.body.password) == false){
                    // If password contains errors
                    res.json({"error": "Password is weak."});
                    return;
                }else{
                    User.create({
                        username: req.body.username,
                        password: req.body.password,
                        email: email,
                        gender: req.body.gender,
                        age: req.body.age
                    }, (error, user) => {
                        if(error){
                            res.json({"error": "Username already exists"});
                            return;
                        }
                        
                        res.json({"redirect": "/"});
                    });
                }
            }else{
                res.json({"error": "Please enter a correct email."});
                return;
            }
        }
    });   
}