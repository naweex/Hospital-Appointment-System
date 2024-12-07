var DoctorSchema = mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    password: String,
    age: { type: Number },
    email: { type: String, unique: true },
    mobile: { type: Number, unique: true },
    speciality: { type: String },
});

var Doctor = mongoose.model('Doctor', DoctorSchema, 'doctor');


module.exports = {
    Doctor
}