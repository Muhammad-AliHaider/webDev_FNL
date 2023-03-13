const jwt = require("jsonwebtoken");
User = require("../models/user");

module.exports = {
verifyToken: function(req, res,next) {
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if (err){
        const decodedToken = jwt.decode(token, {
            complete: true
        });
    
        if(new Date().getTime()/1000> decodedToken.payload.exp){
            if (req.cookies?.jwt) {

                const refreshToken = req.cookies.jwt;
        
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, 
                (err, decoded) => {
                    if (err) {
                        return res.status(406).json({ message: 'Unauthorized' });
                    }
                    else {
                        const accessToken = jwt.sign({
                            id: decoded._id,role: decoded.role}, process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: '300s'
                        });
                        res.cookie('acc', accessToken, { httpOnly: true, 
                        });
        
                    }
                })
            } else {
                return res.status(406).json({ message: 'Unauthorized' });
            }
        }
        else{
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.' });
        }
      } 
      next();
    });
},

verifyAdmin: function (req, res,next){
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role != 1){
        return res.status(406).json({ message: 'Unauthorized: Only Admin Allowed' });
    }
    next();
},

verifyStudent: function(req, res,next) {
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role != 3){
        return res.status(406).json({ message: 'Unauthorized: Only Students Allowed' });
    }
    next();
},

verifyTeacher: function(req, res,next)  {
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role != 2){
        return res.status(406).json({ message: 'Unauthorized: Only Teacher Allowed' });
    }
    next();
},
}






