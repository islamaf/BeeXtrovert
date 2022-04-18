const Room = require('../models/Room')
const User = require('../models/User')

const connectToRoom = async (req, res) => {
    try {
        if (req.session.userLanguagePref === null || req.session.userInterests.length == 0) {
            return res.json({ "error": "Please assign your language or your interests. You will be redirected to your profile shortly.", "redirect": "/editUser" })
        }

        // Search for room with similar user details
        const room = await Room.find({
            userCount: { $lt: 6 },
            ageGroup: req.session.age,
            countryCode: req.session.country_code,
            city: req.session.city,
            language: req.session.userLanguagePref,
            interests: req.session.userInterests
        })

        // Create room if it does not exist
        if (room.length == 0) {
            const generatedRoom = await Room.create({
                ageGroup: req.session.age,
                countryCode: req.session.country_code,
                city: req.session.city,
                language: req.session.userLanguagePref,
                interests: req.session.userInterests
            })

            if (!generatedRoom) {
                throw new Error()
            }

            const user = await User.findById(req.session.userId)
            if (!user) {
                throw new Error()
            } else {
                user.rooms.push({
                    room_id: generatedRoom._id,
                    room_name: generatedRoom.name
                })
                await user.save()
                req.session.rooms = user.rooms
                req.session.save()
            }

            generatedRoom.users.push(req.session.userId)
            generatedRoom.userCount += 1
            await generatedRoom.save()

            return res.json({ "success": "Connecting...", "redirect": "/chat/" + generatedRoom._id })
        }

        // Join room if it exists already
        if (room.length > 0) {
            for (let i = 0; i < room.length; i++) {
                var userChecker = false
                for (let j = 0; j < room[i].users.length; j++) {
                    if (room[i].users[j]._id.toString() === req.session.userId) {
                        userChecker = true
                        break
                    }
                }

                if (!userChecker) {
                    const user = await User.findById(req.session.userId)

                    if (room[i].banned.includes(user._id)) {
                        if (i === room.length - 1) {
                            return res.json({ "error": "No rooms found. Try again later." })
                        }
                        continue
                    }

                    if (user) {
                        user.rooms.push({
                            room_id: room[i]._id,
                            room_name: room[i].name
                        })
                        await user.save()
                        req.session.rooms = user.rooms
                        req.session.save()
                    } else {
                        throw new Error()
                    }

                    room[i].users.push(req.session.userId)
                    room[i].userCount += 1
                    return res.json({ "success":"Connecting...", "redirect": "/chat/" + room[i]._id })
                } 
                
                if (userChecker) {
                    return res.json({ "success":"Connecting...", "redirect": "/chat/" + room[i]._id })
                }

                await room[i].save()
                return res.json({ "success":"Connecting...", "redirect": "/chat/" + room[i]._id })
            }
        }
    } catch (e) {
        console.log(e)
        return res.json({ "error": e })
    }
}

module.exports = {
    connectToRoom
}