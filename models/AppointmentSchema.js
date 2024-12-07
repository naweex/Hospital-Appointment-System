var AppointmentSchema = mongoose.Schema({
    doctorid: { type: mongoose.ObjectId, ref: 'Doctor' },
    patientid: { type: mongoose.ObjectId },
    appointmentdate: {
        type: Date,
        default: () => new Date("<YYYY-mm-dd>"),
        required: 'Must Have Appointment Date'
    },
    slotnumber: {
        type: Number,
        required: 'Must Have Slot Number'
    }
}, { timestamps: true })

var Appointment = mongoose.model('Appointment', AppointmentSchema, 'appointments');



module.exports = {
    Appointment
}