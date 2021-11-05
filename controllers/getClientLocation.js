const geoip = require('geoip-lite');
const User = require('../models/User.js');

module.exports = async (req, res) => {
    const ip = "93.175.11.113";
    const geo = geoip.lookup(ip);

    console.log(geo);
    console.log(geo.country);

    let newLocation = { $set: {geolocation: geo.country.toLowerCase()}};
    await User.updateOne({username:req.session.userName}, newLocation, (err, updated) => {
        if(err) {
            throw err;
        }
        else{
            req.session.geoLocation = geo.country.toLowerCase();
            console.log("Location updated!");
            // res.json({"success": "Username updated.", "redirect":"/"});
            res.redirect("/");
        }
    });

    res.render('pages/getstarted');
}
