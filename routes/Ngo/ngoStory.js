const express = require('express');
const router = express.Router();

const ngoStory  = require('../../controller/ngo.controller/ngoStoryController');

router
    .route('/post')
    .post(ngoStory.postStory);

    router.route('/:storyId')
    .patch(ngoStory.updateStory)
    .delete(ngoStory.deleteStory);




module.exports = router;