const auth = (req, res, next) => {
    if(typeof req.session.userEmail !== 'undefined')
        next();
    else
        res.redirect('login.html');
}

export default auth;