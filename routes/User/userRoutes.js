const express = require('express');
const router = express.Router();

const userController = require('../../controller/user.controller/userControllerApi');

router
    .route('/followersList')
    .get(userController.followerList);

router
    .route('/follow')
    .get(userController.followNgo);

