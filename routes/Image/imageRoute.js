const express = require('express');
const router = express.Router();


router.route('/').post(function (req,res,next) {

    var bucket = process.env.bucketName,
        awsKey = process.env.Access_key_ID,
        secret = process.env.Secret_access_key;

    var fileName = req.body.filename,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString(); // expire in 5 minutes

    var policy =
        {
            "expiration": expiration,
            "conditions": [
                {"bucket": bucket},
                {"key": fileName},
                {"acl": 'public-read'},
                ["starts-with", "$Content-Type", ""],
                ["content-length-range", 0, 524288000]

            ]
        };

    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    res.json({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});

});

module.exports = router;