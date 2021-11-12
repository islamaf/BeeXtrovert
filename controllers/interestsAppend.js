const User = require('../models/User.js');

module.exports = async (req, res) => {
    const interests = req.body.interests;

    const interestsSplit = interests.split(",");
    var interestsArray = []
    for(let i=0; i < interestsSplit.length; i++){
        interestsArray.push(interestsSplit[i].trim());
    }

    // Validate unique strings only
    interestsArray = [...new Set(interestsArray)];

    let pushInterests = {$push: {interests: {$each: interestsArray}}};

    await User.findOneAndUpdate({_id: req.session.userId}, pushInterests, (err, updated) => {
        if(err){
            throw err;
        }else{
            req.session.userInterests = interestsArray;
            req.session.save();
            return res.json({"error":err, "success": "Interests updated.", "redirect": "/"});
        }
    }).catch(() => {
        console.log("Query executed.");
    });
}