import JWT_SECRET from "./config.js"
import jwt from 'jsonwebtoken'


const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  };
  
  // Example usage
  const payload = { username: 'sudharsan' };
  const token = generateToken(payload);
  console.log('Generated JWT:', token);
const authMiddleWare = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(411).json({})
    }
        const token = authHeader.split(' ')[1];

        try{
            const decoded = jwt.verify(token, JWT_SECRET)
            if(decoded.userId){
                req.userId = decoded.userId
                next()
            }
            else{
                return res.status(403).json({});
            }
            
        }catch(err){
                return res.status(403).json({
                    message:err.message
                })
        }
    
    }
export default authMiddleWare
