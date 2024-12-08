const express = require('express');
const JWT = require('jsonwebtoken');
const JWTStrategy = require('passport-jwt').Strategy;
var localStrategy = require('passport-local');
var passport = require('passport');
var {Doctor} = require('../../models/DoctorSchema');
var {Patient} = require('../../models/PatientSchema');
const {StatusCodes} = require('http-status-codes')
const router = express.Router();


//passport local strategy configuration
passport.use('patient' , new localStrategy(async function verify(username , password , cb){
    const querypatient = Patient.where({ username: username });

    await querypatient.findOne().then(function (user){
        if(user.password === password){
            cb(null , user , {
                status : StatusCodes.OK ,
                message : 'login successful',
            });
        }else{
            cb(null , false ,{
                status : StatusCodes.UNAUTHORIZED,
                message : 'Incorrect username or password',
            });
        }
    })
    .catch(function (err){
        cb(null , false , {
            status : StatusCodes.UNAUTHORIZED ,
            message : 'Patient Does Not Exist',
        });
    });
})
);

passport.use(
    "doctor",
    new LocalStrategy(async function verify(username, password, cb) {
        const querydoctor = Doctor.where({ username: username });
        await querydoctor
            .findOne()
            .then(function (user) {
                if (user.password === password) {
                    cb(null, user, {
                        status: 200,
                        message: "Login Successful.",
                    });
                } else {
                    cb(null, false, {
                        status: 401,
                        message: "Incorrect username or password.",
                    });
                }
            })
            .catch(function (err) {
                cb(null, false, {
                    status: 401,
                    message: "Doctor Does Not Exist",
                });
            });
    })
);

//passport jwt strategy configuration
passport.use(
    new JWTStrategy(
    {
        jwtFromRequest: (req) => req.headers["x-access-token"],
            secretOrKey: "secretKeeeey",
    },
    (payload, done) => {
        return done(null, payload);
    }
    )
);
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

//route for registering user and admin
router.post("/registerpatient", async (req, res) => {
    //new user creation from request body data
    var user1 = new Patient(req.body);

    await user1.save().then(
        function (user) {
            if (user) {
                console.log(user.name + " saved to user collection.");
                res.send({ status: 200, message: user.name });
            }
        },
        function (err) {
            //errors for various primary key
            if (Object.keys(err.keyPattern)[0] == "mobile") {
                res.send({
                    status: 500,
                    message: "User with mobile already exist",
                });
            } else if (Object.keys(err.keyPattern)[0] == "username") {
                res.send({
                    status: 500,
                    message: "User with username already exist",
                });
            } else if (Object.keys(err.keyPattern)[0] == "email") {
                res.send({
                    status: 500,
                    message: "User with email already exist",
                });
            } else {
                res.send({ status: 500, message: "Internal Server Error" });
            }
        }
    );
});

//route for registering user and admin
router.post("/registerdoctor", async (req, res) => {
    //new user creation from request body data
    var user1 = new Doctor(req.body);

    await user1.save().then(
        function (user) {
            if (user) {
                console.log(user.name + " saved to user collection.");
                res.send({ status: 200, message: user.name });
            }
        },
        function (err) {
            //errors for various primary key
            if (Object.keys(err.keyPattern)[0] == "mobile") {
                res.send({
                    status: 500,
                    message: "User with mobile already exist",
                });
            } else if (Object.keys(err.keyPattern)[0] == "username") {
                res.send({
                    status: 500,
                    message: "User with username already exist",
                });
            } else if (Object.keys(err.keyPattern)[0] == "email") {
                res.send({
                    status: 500,
                    message: "User with email already exist",
                });
            } else {
                res.send({ status: 500, message: "Internal Server Error" });
            }
        }
    );
});

//route for logging user in
router.post("/login", (req, res) => {
    const isDoctor = req.body.isDoctor === "true";
    if (isDoctor) {
        passport.authenticate(
            "doctor",
            { session: false },
            (err, user, info) => {
                if (err || !user) {
                    return res.send({ status: 401, message: info.message });
                }
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    var userobject = {
                        userid: user["_id"],
                        username: user.username,
                        isDoctor: true,
                    };
                    var token = jwt.sign(userobject, "examplesecret");
                    req.session.jwt = token;
                    return res.send({ status: 200, token: token });
                });
            }
        )(req, res);
    } else {
        passport.authenticate(
            "patient",
            { session: false },
            (err, user, info) => {
                if (err || !user) {
                    return res.send({ status: 401, message: info.message });
                }
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    var userobject = {
                        userid: user["_id"],
                        username: user.username,
                        isDoctor: false,
                    };
                    var token = jwt.sign(userobject, "examplesecret");
                    req.session.jwt = token;
                    return res.send({ status: 200, token: token });
                });
            }
        )(req, res);
    }
});

//route for logging out user
router.post("/logout", (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

//route for getting session in frontend
router.get("/session", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            res.send(false);
        } else {
            res.send(user);
        }
    })(req, res);
});

module.exports = router;