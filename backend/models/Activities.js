const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const activitiesSchema = new Schema({
    title: { type: String, required: true },
    createdDate: { type: Date, required: true },
    streak: { type: Number, default: 0 },
    dailyStatus: [{ 
        date: { type: Date, required: true },
        completed: { type: Boolean, default: false }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Activities', activitiesSchema);
