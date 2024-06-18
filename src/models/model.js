const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userID: {required: true, type: String },
    lastCompletedGrade: {required: true, type: Number },
    simID: {required: true, type: String },
    gradeWasSubmitted: {required: true, type: Boolean },
    timeCompleted: {required: true, type: Date}
})

module.exports = mongoose.model('Data', dataSchema)