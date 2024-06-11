const auth = (req, res, next) => {
    if(req.session.userEmail)
        next();
    else
        res.redirect('login.html');
}

export default auth;