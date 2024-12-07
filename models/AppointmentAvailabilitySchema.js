var AppointmentAvailabilitySchema = mongoose.Schema({
    doctorid: { type: mongoose.ObjectId, ref: 'Doctor' },
    appointmentdate: {
        type: Date,
        ref: 'Appointment'
    },
    appointmentsavailable: {
        type: Object
    }
}, { timestamps: true })

var AppointmentAvailability = mongoose.model('AppointmentAvailability', AppointmentAvailabilitySchema, 'appointmentavailability');

module.exports = {
    AppointmentAvailability
}