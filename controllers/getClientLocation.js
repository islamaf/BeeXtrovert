const geoip = require('geoip-lite');
const User = require('../models/User.js');

module.exports = async (req, res) => {
    const ip = "93.175.11.113";
    const geo = geoip.lookup(ip);

    console.log(geo);
    console.log(geo.country);

    let newLocation = { $set: {geolocation: geo.country.toLowerCase()}};
    await User.updateOne({_id:req.session.userId}, newLocation, (err, updated) => {
        if(err) {
            throw err;
        }
        else{
            req.session.geoLocation = geo.country.toLowerCase();
            console.log("Location updated!");
            return res.json({"success": "Location updated.", "redirect":"/", "newLocation":geo.country});
        }
    }).catch(function () {
        if(req.body.done == "done"){
            console.log("Query already executed.");
            console.log(req.body.done);
            return;
        }
    });

    // return geo.country;
    // res.render('pages/getstarted');
}
