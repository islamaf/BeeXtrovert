const User = require('../models/User.js');
const bcrypt = require('bcrypt');

exports.changeUsername = async (req, res) => {
    const newUsername = req.body.username;
    const usernameFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let updateUsername = { $set: {username: newUsername}};

    if(usernameFormat.test(newUsername)){
        res.json({"error": "Username cannot contain symbols."});
        return;
    }else{
        if(typeof newUsername !== 'undefined' && newUsername){
            await User.findOne({username:newUsername}, (err, user) => {
                if(user){
                    res.json({"error": "Username taken."});
                    return;
                }else{
                    User.findOneAndUpdate({_id:req.session.userId}, updateUsername, (err, updated) => {
                        if(err) {
                            throw err;
                        }
                        else{
                            req.session.userName = newUsername;
                            res.json({"success": "Username updated.", "redirect": "/editUser"});

                            return;
                        }
                    });
                }
            }).clone().catch(function(err){ console.log(err)});
        }
    }
}

exports.changePassword = async (req, res) => {
    const newPassword = req.body.password;
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/
    
    if(passwordFormat.test(req.body.password) == false){
        // If password contains errors
        res.json({"error": "Password is weak."});
        return;
    }else{
        if(typeof newPassword !== 'undefined' && newPassword){
            await User.findOne({_id:req.session.userId}, (err, user) => {
                if(user){
                    bcrypt.hash(newPassword, 10, (err, hash) => {
                        User.findOneAndUpdate({_id:req.session.userId}, { $set: {password: hash}}, (err, updated) => {
                            if(err) {
                                throw err;
                            }
                            else{
                                user.password = hash;
                                req.session.save();
                            }
                        });
                    });

                    res.json({"success": "Password updated.", "redirect": "/editUser"});
                    return;
                }else{
                    throw err;
                }
            }).clone().catch(function(err){ console.log(err)});
        }
    }
}

exports.changeEmail = (req, res) => {
    const newEmail = req.body.email;
    let updateEmail = { $set: {email: newEmail}};

    if(typeof newEmail !== 'undefined' && newEmail){
        User.findOneAndUpdate({_id:req.session.userId}, updateEmail, (err, updated) => {
            if(err) {
                throw err;
            }
            else{
                req.session.userEmail = newEmail;
                req.session.save();
                res.json({"success": "Email updated.", "redirect": "/editUser"});
                return;
            }
        }).clone().catch(function(err){ console.log(err)});
    }
}