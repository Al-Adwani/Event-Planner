const mongoose = require("mongoose");
const Event = require("../../models/Events");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePositiveInt = (value, fallback) => {
  const num = parseInt(value, 10);
  return Number.isInteger(num) && num > 0 ? num : fallback;
};

// Looks up an event by id; responds 404 (and returns null) if the id is
// malformed or no event matches.
const findEventOr404 = async (req, res) => {
  const { eventId } = req.params;
  const event = mongoose.isValidObjectId(eventId)
    ? await Event.findById(eventId)
    : null;
  if (!event) res.status(404).json({ message: "This event doesn't exist" });
  return event;
};

// GET /api/events
// Query params:
//   name   - case-insensitive partial match on the event name
//   order  - "asc" (default) or "desc", sorted by startDate
//   page   - page number, starting at 1 (default 1)
//   limit  - results per page (default 10, max 100)
const EventFitch = async (req, res, next) => {
  try {
    const { name, order } = req.query;
    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(
      parsePositiveInt(req.query.limit, DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const filter = {};
    if (name) filter.name = { $regex: escapeRegex(name), $options: "i" };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ startDate: order === "desc" ? -1 : 1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Event.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/upcoming - events that haven't started yet, soonest first
const EventFitchUpcoming = async (req, res, next) => {
  try {
    const events = await Event.find({ startDate: { $gt: new Date() } }).sort({
      startDate: 1,
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const fitchDetail = async (req, res, next) => {
  try {
    const event = await findEventOr404(req, res);
    if (event) res.json(event);
  } catch (error) {
    next(error);
  }
};

// GET /api/events/fullyBooked
const EventFitchFull = async (req, res, next) => {
  try {
    const events = await Event.find({
      $expr: { $eq: ["$bookedSeats", "$numOfSeats"] },
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const eventCreate = async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

const eventDelete = async (req, res, next) => {
  try {
    const event = await findEventOr404(req, res);
    if (event) {
      await event.deleteOne();
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
};

const eventUpdate = async (req, res, next) => {
  try {
    const event = await findEventOr404(req, res);
    if (event) {
      // set() + save() runs schema validators (including bookedSeats <= numOfSeats).
      event.set(req.body);
      await event.save();
      res.json(event);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  EventFitch,
  EventFitchUpcoming,
  eventCreate,
  eventDelete,
  eventUpdate,
  fitchDetail,
  EventFitchFull,
};
