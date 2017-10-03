var jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var bearerHeader = req.headers["authorization"];
    if(!token && typeof bearerHeader !== 'undefined'){
        var bearer = bearerHeader.split(" ");
        token = bearer[1];
    }
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'tokenbasedAuthentication', function(err, decoded) {
            if (err) { //failed verification.
                return res.json({
                    error: false,
                    Message: "You are in wrong territory. Go Back!"
                });
            }
            req.decoded = decoded;
            // console.log('DECODED is ')
            // console.log(decoded);
            next(); //no error, proceed
        });
    } else {
        // forbidden without token
        return res.status(403).send({
            "error": true,
            'message':"No Token Provided. Please attach a Token"
        });
    }
}