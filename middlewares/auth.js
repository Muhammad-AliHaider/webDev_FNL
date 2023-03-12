const jwt = require("jsonwebtoken");
User = require("../models/user");

const verifyToken = (req, res,next) => {
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if (err){
        const decodedToken = jwt.decode(token, {
            complete: true
        });
        console.log(decodedToken.payload.exp)
        console.log(new Date().getTime()/1000)
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
};

const verifyAdmin = (req, res,next) => {
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role != 1){
        return res.status(406).json({ message: 'Unauthorized: Only Admin Allowed' });
    }
    next();
};

const verifyStudent = (req, res,next) => {
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role != 3){
        return res.status(406).json({ message: 'Unauthorized: Only Teachers Allowed' });
    }
    next();
};

const verifyTeacher = (req, res,next) => {
    
    var token = req.cookies.acc;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role != 2){
        return res.status(406).json({ message: 'Unauthorized: Only Teacher Allowed' });
    }
    next();
};


module.exports = verifyToken;
module.exports = verifyAdmin;
module.exports = verifyStudent;
module.exports = verifyTeacher;



