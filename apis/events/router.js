const express = require("express");
const router = express.Router();

const {
  EventFitch,
  eventCreate,
  eventDelete,
  eventUpdate,
  fitchDetail,
  EventFitchFull,
} = require("./controllers");
router.get("/api/events/fullyBooked", EventFitchFull);

router.get("/api/events", EventFitch);
router.get("/api/events/:eventId", fitchDetail);


router.post("/api/events", eventCreate);

router.delete("/api/events/:eventId", eventDelete);

router.put("/api/events/:eventId", eventUpdate);

module.exports = router;
