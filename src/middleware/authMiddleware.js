const User = require('../models/User.js')
let admin_array = ["islam", "marvin", "Lordhomie"];

module.exports = (req, res, next) => {
    User.findOne({$and: [{_id:req.session.userId, isAdmin: true}]}, (error, user ) =>{
        if(!user || error){
            return res.redirect('/');
        }
        next();
    });
}
