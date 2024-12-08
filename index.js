const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
var session = require('express-session');
const MongoStore = require("connect-mongo");
const port = 5000;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
mongoose.connect('mongodb://localhost:27017/hospitalAppointment').then(()=>{
    console.log('successfully connected to mongodb');
}).catch((err) =>{
    console.log('failed to connect to database :' + err);
})
const db = mongoose.connection
//session configuration
app.use(session({
    secret: 'gfgsecret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        client: db.getClient(),
        dbName: 'testdb',
        collectionName: "sessions",
        stringify: false,
        autoRemove: "interval",
        autoRemoveInterval: 1
    })
}));

//app.use('/', authRouter);
//app.use('/', hospitalRouter);

//server listening
app.listen(port, () => {
    console.log(`server started on ${port}`);
});