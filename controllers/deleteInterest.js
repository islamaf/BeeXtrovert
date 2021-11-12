const User = require('../models/User.js');

module.exports = async (req, res) => {
    const interest_to_delete = req.params.interest;

    console.log(interest_to_delete);

    await User.updateOne({_id: req.session.userId}, {$pull: {interests: interest_to_delete}}, async (err, interest) => {
        if(err) {
            throw err;
        }

        await User.findOne({_id: req.session.userId}, (err, interest) => {
            if(err) {
                throw err;
            }

            req.session.userInterests = interest.interests;
            return res.json({"success":"Deleted.", "redirect":"/editUser"});
        }).catch(() => {
            console.log("Query executed.");
        });
    }).catch(() => {
        console.log("Query executed.");
    });
}