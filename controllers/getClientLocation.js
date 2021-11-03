const geoip = require('geoip-lite');
const User = require('../models/User.js');

module.exports = (req, res) => {
    const ip = "93.175.11.113";
    const geo = geoip.lookup(ip);

    console.log(geo);
    console.log(geo.country);

    let newLocation = { $set: {geolocation: geo.country.toLowerCase()}};
    User.updateOne({username:req.session.userName}, newLocation, (err, updated) => {
        if(err) {
            throw err;
        }
        else{
            console.log("Location updated!");
        }
    });

    res.render('pages/getstarted');
}
