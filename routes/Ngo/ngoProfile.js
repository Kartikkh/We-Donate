const express = require('express');
const router = express.Router();

const ngoProfile  = require('../../controller/ngo.controller/ngoProfileController');

router
    .route('/:ngoId')
    .get(ngoProfile.getProfile)
    .patch(ngoProfile.updateProfile)
    .delete(ngoProfile.deleteProfile);


// router
//     .route('/follow/:ngoId')
//     .get(ngoProfile.follower)

module.exports = router;