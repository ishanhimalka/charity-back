const express = require("express");
const router = express.Router();
const uploadEventImages = require("../middleware/eventMulter");
const {
    addEvent,
    getEvents,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByLocation,
    get3EventsByStatus,
    get3UpcomingEventsByLocation,
    getAllUpcomingEventsByLocation,
    uploadEventImagesController,
    addCommentToEvent,
    addUserToEvent,
    removeUserFromEvent,
    getAllEvents
} = require("../controllers/eventController");
const { authenticate } = require("../middleware/auth");

// Add new event
router.post("/add", authenticate, addEvent);

// Get events
router.get("/", authenticate, getEvents);

// Update event
router.put("/update", authenticate, updateEvent);

// Delete event
router.delete("/delete", authenticate, deleteEvent);

//Get event by id
router.get("/:eventId", authenticate, getEventById);

//Get event by location
router.get("/location/:location", authenticate, getEventsByLocation);

//Get 3 events by status
router.get("/status/:status", get3EventsByStatus);

//Get 3 upcoming events by location
router.get(
    "/upcoming-3-by-location/:location",
    authenticate,
    get3UpcomingEventsByLocation
);

//Get all upcoming events by location
router.get(
    "/upcoming-all-by-location/:location",
    authenticate,
    getAllUpcomingEventsByLocation
);

//Get all upcoming events
router.get(
    "/allEvents/:status",
    getAllEvents
);

// Route for uploading event images
router.post(
    "/upload-images",
    uploadEventImages.array("images", 10),
    uploadEventImagesController
);

// Add comment to event
router.post("/add-comment/:eventId", authenticate, addCommentToEvent);

// Add user to event
router.post("/:eventId/attend", authenticate, addUserToEvent);

// Remove user from event
router.delete("/:eventId/attend", authenticate, removeUserFromEvent);

module.exports = router;
