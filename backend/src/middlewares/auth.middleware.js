import jwt from "jsonwebtoken";
const authenticateToken = (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers["authorization"];
    if(authHeader !== undefined){
        jwtToken = authHeader.split(" ")[1];
    }

    if(jwtToken === undefined){
        res.status(401);
        res.send("Invalid JWT Token");
    } else{
        jwt.verify(jwtToken, process.env.SECRET_KEY, (err, payload) => {
            if(err){
                res.status(401);
                res.send("Invalid JWT Token");
            } else{
                req.user_id = payload.user_id;
                next();
            }
        })
    }
}

export default authenticateToken