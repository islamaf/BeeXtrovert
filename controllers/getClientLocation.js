const geoip = require('geoip-lite');
const User = require('../models/User.js');
const axios = require('axios')

module.exports = (req, res) => {
    const lat = req.body.lat;
    const long = req.body.long;

    // const lat = 55.764994
    // const long = 37.625187
    
    axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=jsonv2`).then(resp => {
        const countryCode = resp.data.address.country_code;
        const country = resp.data.address.country;
        const city = resp.data.address.city;

        let newLocation = { $set: {"geolocation.country_code": countryCode.toLowerCase(), "geolocation.country": country.toLowerCase(), "geolocation.city": city.toLowerCase()}};
        User.updateOne({_id:req.session.userId}, newLocation, (err, updated) => {
            if(err) {
                throw err;
            }
            else{
                req.session.country_code = countryCode.toLowerCase();
                req.session.country = country.toLowerCase();
                req.session.city = city.toLowerCase();
                console.log("Location updated!");
                return res.json({
                    "success": "Location updated.", 
                    "redirect":"/", 
                    "country_code":countryCode.toUpperCase(),
                    "country":country.toUpperCase(),
                    "city":city.toUpperCase()
                });
            }
        }).catch(function () {
            if(req.body.done == "done"){
                console.log("Query already executed.");
                console.log(req.body.done);
            }
        });
    }).catch(function(){
        console.log("Error!");
    });

    // const ip = "93.175.11.113";
    // const geo = geoip.lookup(ip);

    // console.log(geo);
    // console.log(geo.country);

    // let newLocation = { $set: {geolocation: geo.country.toLowerCase()}};
    // await User.updateOne({_id:req.session.userId}, newLocation, (err, updated) => {
    //     if(err) {
    //         throw err;
    //     }
    //     else{
    //         req.session.geoLocation = geo.country.toLowerCase();
    //         console.log("Location updated!");
    //         return res.json({"success": "Location updated.", "redirect":"/", "newLocation":geo.country});
    //     }
    // }).catch(function () {
    //     if(req.body.done == "done"){
    //         console.log("Query already executed.");
    //         console.log(req.body.done);
    //         return;
    //     }
    // });

    // return geo.country;
    // res.render('pages/getstarted');
}
