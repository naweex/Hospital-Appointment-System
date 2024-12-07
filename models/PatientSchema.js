const { default: mongoose } = require("mongoose");

var PatientSchema = mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    password: String,
    age: { type: Number },
    email: { type: String, unique: true },
    mobile: { type: Number, unique: true },
});
var Patient = mongoose.model('Patient', PatientSchema, 'patient');

module.exports = {
    Patient
}