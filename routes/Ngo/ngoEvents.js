const express = require('express');
const router = express.Router();
const ngoEvents = require('../../controller/ngo.controller/ngoEventController');



//posting Events
router
    .route('/post')
    .post(ngoEvents.postEvent)
    .get(ngoEvents.getAllEventForNgo)


// Getting Detail page , Update and delete Event Route
router
    .route('/:postId')
    .get(ngoEvents.getEventById)
    .patch(ngoEvents.updateEvent)
    .delete(ngoEvents.deleteEvent);

module.exports = router;