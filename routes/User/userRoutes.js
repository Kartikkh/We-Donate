const express = require('express');
const router = express.Router();

const userController = require('../../controller/user.controller/userControllerApi');


router
    .route('/getFollowedEvents')
    .get(userController.followedEvent);

router
    .route('/followersList')
    .get(userController.followerList);

router
    .route('/follow')
    .get(userController.followNgo);


router
    .route('/like')
    .get(userController.like);



router
    .route('/going')
    .get(userController.going);



router
    .route('/interested')
    .get(userController.interested);




module.exports = router;