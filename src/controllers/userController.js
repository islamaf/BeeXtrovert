const User = require('../models/User.js');
const Room = require('../models/Room')
var mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const { io } = require('../server')
const mainNamespace = io.of("/")
const { getUsersInRoom } = require('../utils/roomFunctionalities')
const { generateMessage } = require('../utils/messages')

const storeUser = (req, res) => {
    const email = req.body.email.toLowerCase();

    const usernameFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/

    User.findOne({ email: email }, (err, duplicate) => {
        if (duplicate) {
            // If email is already registered
            return res.json({ "error": "Email already registered." });
        }
        else {
            // If email was never registered before
            if (emailValidator.validate(email)) {
                if (usernameFormat.test(req.body.username)) {
                    // If username contains errors
                    return res.json({ "error": "Username cannot contain symbols." });
                } else if (passwordFormat.test(req.body.password) == false) {
                    // If password contains errors
                    return res.json({ "error": "Password is weak." });
                } else if (typeof req.body.gender === 'undefined') {
                    return res.json({ "error": "Please select your gender." });
                } else if (typeof req.body.age === 'undefined') {
                    return res.json({ "error": "Please select your age." });
                } else {
                    User.create({
                        username: req.body.username,
                        password: req.body.password,
                        email: email,
                        gender: req.body.gender,
                        age: req.body.age
                    }, (error, user) => {
                        if (error) {
                            return res.json({ "error": "Username already exists" });
                        }

                        res.json({ "redirect": "/" });
                    });
                }
            } else {
                return res.json({ "error": "Please enter a correct email." });
            }
        }
    });
}

const loginUser = (req, res) => {
    const usernameEmail = req.body.usernameEmail;
    const password = req.body.password;

    User.findOne({ $or: [{ username: usernameEmail }, { email: usernameEmail.toLowerCase() }] }, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    req.session.userId = user._id;
                    req.session.userName = user.username;
                    req.session.userEmail = user.email;
                    req.session.country_code = user.geolocation.country_code;
                    req.session.country = user.geolocation.country;
                    req.session.city = user.geolocation.city;
                    req.session.age = user.age;
                    req.session.userLanguagePref = user.languagePref;
                    req.session.userInterests = user.interests;
                    req.session.rooms = user.rooms;
                    req.session.isAdmin = user.isAdmin;

                    return res.json({ "redirect": "/" });
                } else {
                    return res.json({ "error": "Wrong password." });
                }
            });
        } else {
            return res.json({ "error": "Username doesn't exist." });
        }
    });
}

const deleteUser = async (req, res) => {
    User.deleteOne({ _id: req.session.userId }, (err, deleted) => {
        if (err) {
            throw err;
        }

        return res.json({ "success": "Account deleted.", "redirect": "/logout" });
    });
}

const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

const reportUser = async (req, res) => {
    let room_id = req.params.room
    let user_id = req.params.user
    user_id = user_id
    room_id = mongoose.Types.ObjectId(room_id)
    curr_user_id = req.session.userId

    try {
        const room = await Room.findById(room_id)

        if (!room) {
            throw new Error()
        }

        if (req.session.userId !== user_id) {
            const isFound = room.reports.some(obj => obj.from.toString() === curr_user_id && obj.to.toString() === user_id)

            if (!isFound) {
                room.reports.push({
                    from: req.session.userId,
                    to: user_id
                })

                let reportCount = 0
                for (var i = 0; i < room.reports.length; i++) {
                    if (room.reports[i].to.toString() === user_id) {
                        reportCount += 1
                    }
                }

                if (reportCount === room.userCount - 1 && room.userCount > 2) {
                    room.users = room.users.filter(user => user._id.toString() !== user_id)
                    room.userCount -= 1
                    room.banned.push(mongoose.Types.ObjectId(user_id))

                    const kickedUser = await User.findById(mongoose.Types.ObjectId(user_id))

                    kickedUser.rooms = kickedUser.rooms.filter(room => room.room_id.toString() !== room_id.toString())
                    await kickedUser.save()

                    const allUsers = await getUsersInRoom(curr_user_id, room)

                    mainNamespace.on("connection", (socket) => {
                        socket.on('reportUser', async (callback) => {
                            io.to(room_id.toString()).emit('roomData', {
                                name: room.name,
                                room_id: room_id.toString(),
                                users: allUsers
                            })

                            let roomUsers = await io.in(room_id.toString()).fetchSockets()
                            if (roomUsers) {
                                for(var i = 0; i < roomUsers.length; i++){
                                    if (roomUsers[i].handshake.session.userId == user_id) {
                                        io.in(roomUsers[i].id).socketsLeave(room_id.toString());
                                        io.in(roomUsers[i].id).disconnectSockets();
                                        break
                                    }
                                }
                            }

                            socket.broadcast.to(room_id.toString()).emit('message', generateMessage(undefined, 'Admin', room_id.toString(), `${kickedUser.username} has been kicked!`))

                            callback()
                        })
                    })

                    await room.save()
                    return res.json({ "refresh": "/chat/" + room_id.toString() })
                }

                await room.save()
            } else {
                return res.json({ "error": "You already reported this user." })
            }
        } else {
            return res.json({ "error": "You can not report yourself!" })
        }

        return res.json({ "success": "User has been reported!" })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    storeUser,
    loginUser,
    logoutUser,
    deleteUser,
    reportUser
}