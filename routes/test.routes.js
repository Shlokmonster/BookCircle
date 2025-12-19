import express from "express"
import authmiddleware from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/protected",(req,res,authmiddleware)=>{
      res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default router;