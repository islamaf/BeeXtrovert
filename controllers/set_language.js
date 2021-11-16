const User = require('../models/User.js');
module.exports = (req, res) => {
    const user_language= req.body.selectLanguage;
    console.log(user_language);
    if(typeof req.body.selectLanguage === 'undefined')
    {
        res.json({"error": "Please select your language."});
        return;
    }
    else{
        let newLanguage = { $set: {languagePref: user_language.toLowerCase()}};
        User.updateOne({username:req.session.userName}, newLanguage, (err, updated) => {
            if(err) {
                console.log(err);
                throw err;
            }
            else{
                req.session.languagePref = user_language.toLowerCase();
                console.log("Language Preference updated!");
                res.json({"redirect": "/"});
                return;
            }
        });

    }
}