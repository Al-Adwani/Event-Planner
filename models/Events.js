const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  organizer: { type: String, unique: true, minLength: 20 },
  name: String,
  email: String,
  image: { type: String, required: true },
  numOfSeats: {type:Number, min:5},
  bookedSeats: { type: Number, default: 0 , max: this.numOfSeats},
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("Event", EventSchema);
