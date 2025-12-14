import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
const secretOrPrivateKey = process.env.jwt_key

const Setuser = (user)=>{
   return jwt.sign(user, secretOrPrivateKey, { expiresIn: '24h' })
}

const getuser = (token)=>{
    if(!token){
        return null
    }
    return jwt.verify(token, secretOrPrivateKey)
}

export {Setuser,getuser};