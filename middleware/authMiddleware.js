const User = require('../models/User.js')
let admin_array = ["islam", "marvin", "Lordhomie"];

module.exports = (req, res, next) => {
    User.findOne({isAdmin: true}, (error, user ) =>{
        if(!admin_array.includes(req.session.userName) || error || !user ){
            console.log("User not authorized as admin.");
            return res.redirect('/');
        }

        next();
    });
}
