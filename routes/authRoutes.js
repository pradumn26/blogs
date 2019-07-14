const passport = require('passport');

const mongoUtil = require('../util/mongoUtil');

module.exports = (app) => {
    app.get('fetchUser', (req, res) => {
        res.send(req.user);
    });

    app.get('/login',
        passport.authenticate('local', {successRedirect: '/', failureRedirect: '/'}));

    app.post('/signUp', (req, res) => {
        let {email, password} = req.body;
        if (!email || !password)
            return res.send({err: 'Some parameters are missing!!'});

        let db = mongoUtil.getDb();
        let usersCollection = db.collection('users');

        usersCollection.findOne({email})
            .then(function (user) {
                if (user)
                    return res.send({err: 'User already exist'});

                let newUser = {email, password};
                usersCollection.insert(newUser)
                    .then(function () {
                        req.login(newUser, function () {
                            res.redirect('/');
                        })
                    })
            })
    });
};