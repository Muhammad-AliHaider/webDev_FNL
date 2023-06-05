const jwt = require("jsonwebtoken");
User = require("../models/user");

module.exports = {
verifyToken: function(req, res,next) {
    console.log('No')
    const authHeader = req.headers['authorization'];
    // Extract token from header
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    //console.log('token',token)
    const rtoken = req.headers['refresh-token'];
    //console.log('rtoken',rtoken)
    
    
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if (err){
        const decodedToken = jwt.decode(token, {
            complete: true
        });
    
        if(new Date().getTime()/1000> decodedToken.payload.exp){
            if (rtoken) {

                const refreshToken = rtoken;
        
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, 
                (err, decoded) => {
                    if (err) {
                        return res.status(406).json({auth: false, message: 'Unauthorized' });
                    }
                    else {
                        const accessToken = jwt.sign({
                            id: decoded._id,role: decoded.role}, process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: '300s'
                        });
                        res.set('Access-Control-Expose-Headers', 'access');
                        res.set('Access', accessToken);
        
                    }
                })
            } else {
                return res.status(406).json({auth: false, message: 'Unauthorized' });
            }
        }
        else{
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.' });
        }
      } 
      res.set('Access-Control-Expose-Headers', 'access');
      res.set('Access', token);
      next();
    });
},

verifyAdmin: function (req, res,next){
    
    const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
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
    
    console.log(req.headers['authorization'])
    const authHeader = req.headers['authorization'];

    console.log(authHeader);
    // Extract token from header
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role == 2){
        return res.status(406).json({ message: 'Unauthorized: Only Students Allowed' });
    }
    next();
},

verifyTeacher: function(req, res,next)  {
    
    const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token);
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    if (decodedToken.payload.role == 3){
        return res.status(406).json({ message: 'Unauthorized: Only Teacher Allowed' });
    }
    next();
},
}






