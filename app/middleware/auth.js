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