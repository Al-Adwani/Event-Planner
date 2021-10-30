const mongoose = require("mongoose");
const validator = require("validator");

function notTheEventName(name) {
  return name !== "event";
}

const EventSchema = new mongoose.Schema({
  organizer: { type: String, unique: true, maxLength: 20 },
  name: {
    type: String,
    validate: notTheEventName,
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
      isAsync: false,
    },
  },
  image: { type: String, required: true },
  numOfSeats: { type: Number, min: 5 },
  bookedSeats: {
    type: Number,
    default: 0,
    required: (num) => this.numOfSeats >= num,
  },
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("Event", EventSchema);
