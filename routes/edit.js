module.exports = (req, res) => {
    res.render('pages/editUser', {userName: req.session.userName, userEmail: req.session.userEmail});
}