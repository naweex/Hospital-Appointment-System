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