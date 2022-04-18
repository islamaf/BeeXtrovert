module.exports = async (req, res) => {
    res.render('pages/editUser', {
        userName: req.session.userName,
        userEmail: req.session.userEmail, 
        userLanguage: req.session.userLanguagePref,
        userInterests: req.session.userInterests
    });
}