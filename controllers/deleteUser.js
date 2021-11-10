const User = require('../models/User.js');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    User.deleteOne({_id: req.session.userId}, (err, deleted) => {
        if(err){
            throw err;
        }

        res.json({"success":"Account deleted.", "redirect":"/logout"});
    });
}
