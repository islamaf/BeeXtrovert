const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');

const changePassword = async (req, res) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/

    try {
        const user = await User.findById(req.session.userId)
        if (!user) {
            throw new Error()
        }

        bcrypt.compare(oldPassword, user.password, (err, same) => {
            if (same) {
                if (passwordFormat.test(newPassword) == false) {
                    res.json({ "error": "Password is weak." });
                    return;
                } else {
                    if (typeof newPassword !== 'undefined' && newPassword) {
                        bcrypt.hash(newPassword, 10, async (err, hash) => {
                            user.password = hash
                            await user.save()
                            req.session.save()
                        })
                        return res.json({ "success": "Password updated." });
                    }
                }
            }

            return res.json({ "error": "Old password is incorrect." })
        })
    } catch (e) {
        console.log(e)
    }
}

const changeEmail = async (req, res) => {
    const newEmail = req.body.newEmail

    try {
        const user = await User.findById(req.session.userId)

        if (!user) {
            throw new Error()
        }

        if (emailValidator.validate(newEmail)){
            user.email = newEmail
            await user.save()

            req.session.userEmail = newEmail
            req.session.save()

            return res.json({ "success": "Email updated." })
        } else {
            return res.json({ "error": "Email format is incorrect." })
        }
    } catch (e) {
        console.log(e)
    }
}

const changeLanguage = async (req, res) => {
    const language = req.body.language

    try {
        const user = await User.findById(req.session.userId)

        if (!user) {
            throw new Error()
        }

        user.languagePref = language
        await user.save()

        req.session.userLanguagePref = language
        req.session.save()
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    changePassword,
    changeEmail,
    changeLanguage
}