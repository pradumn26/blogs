const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectId;

const mongoUtil = require('./mongoUtil');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    mongoUtil.getDb().collection('users')
        .findOne({_id: ObjectId(id)})
        .then(function (user) {
            if (user)
                done(null, user);
        })
        .catch(function (err) {
            done(err);
        })
});

passport.use(new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    function(email, password, done) {
        let db = mongoUtil.getDb();
        let usersCollection = db.collection('users');

        usersCollection.findOne({email, password})
            .then(function (user) {
                if (!user)
                    return done(null, false);

                return done(null, user);
            })
            .catch(function (err) {
                done(err);
            })
    }
));