const express = require('express');
const router = express.Router();
const ngoEvents = require('../../controller/ngo.controller/ngoEventController');



//posting Events
router
    .route('/postEvent')
    .post(ngoEvents.postEvent);


// Getting Detail page , Update and delete Event Route
router
    .route('/Event/:postId')
    .get(ngoEvents.getEvent)
    .patch(ngoEvents.updateEvent)
    .delete(ngoEvents.deleteEvent);