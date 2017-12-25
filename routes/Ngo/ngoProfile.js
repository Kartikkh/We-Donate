const express = require('express');
const router = express.Router();

const ngoProfile  = require('../../controller/ngo.controller/ngoProfileController');

router
    .route('/')
    .get(ngoProfile.getProfile)
    .patch(ngoProfile.updateProfile)
    .delete(ngoProfile.deleteProfile);


router
    .route('/viewNgoProfile')
    .get(ngoProfile.viewNgoProfile);

module.exports = router;