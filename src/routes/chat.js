module.exports = (req, res) => {
    res.render('pages/chat', {
        userName: req.session.userName
    });
}