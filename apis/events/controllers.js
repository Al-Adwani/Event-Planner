const Event = require("../../models/Events");

const EventFitch = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json(events);
    console.log("EventFitch is working");
  } catch (error) {
    next(error);
  }
};

const fitchDetail = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const events = await Event.find({ _id: eventId });
    res.json(events);
    console.log("fitchDetail is working");
  } catch (error) {
    next(error);
  }
};

const EventFitchFull = async (req, res, next) => {
  try {
    let events = await Event.find();
    events = events.filter((event) => event.bookedSeats === event.numOfSeats);
    console.log(events);
    res.json(events);
    console.log("EventFitchFull is working");
  } catch (error) {
    next(error);
  }
};
const eventCreate = async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
    console.log("EventCreate is working");
  } catch (error) {
    next(error);
  }
};

const eventDelete = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    console.log(eventId);

    const foundEvent = await Event.findById(eventId);

    console.log(foundEvent._id);

    if (foundEvent) {
      foundEvent.remove();
      res.status(204).end();
      console.log("eventDelete is working");
    } else {
      return res.status(404).json({ message: "this Event doesn't exist" });
    }
  } catch (error) {
    next(error);
  }
};

const eventUpdate = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const foundEvent = await Event.findById(eventId);
    if (foundEvent) {
      const updatedEvent = await foundEvent.updateOne(req.body);
      res.status(204).json(updatedEvent);
      console.log("eventUpdate is working");
    } else {
      return res.status(404).json({ message: "this event doesn't exist" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  EventFitch,
  eventCreate,
  eventDelete,
  eventUpdate,
  fitchDetail,
  EventFitchFull,
};
