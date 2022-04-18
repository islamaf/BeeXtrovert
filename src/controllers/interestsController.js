const User = require('../models/User.js');

const appendInterest = async (req, res) => {
    const interest = req.body.interest;

    try {
        const user = await User.findById(req.session.userId)

        if (!user) {
            throw new Error()
        }

        user.interests.push(interest)
        await user.save()

        req.session.userInterests = user.interests
        req.session.save()
    } catch (e) {
        console.log(e)
    }
}

const deleteInterest = async (req, res) => {
    const interest = req.body.interest

    try {
        const user = await User.findById(req.session.userId)

        if (!user) {
            throw new Error()
        }

        user.interests.push(interest)
        user.interests = user.interests.filter(item => item !== interest)
        await user.save()

        req.session.userInterests = user.interests
        req.session.save()
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    appendInterest,
    deleteInterest
}