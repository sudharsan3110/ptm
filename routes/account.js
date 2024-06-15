import  express  from 'express'
import  authMiddleWare  from '../middleware.js' ;
import  db from "../db.js"
const router = express.Router();
const {User,Account} = db;
router.get('/balance',authMiddleWare,async(req,res)=>{
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance 
    })
});

router.post("/transfer",authMiddleWare, async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const{amount,to} = req.body;
    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }
    const toAccount = await Account.findOne({
        userId : to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid user"
        })
    }

    await Account.updateOne({
        userId:req.userId
    },{$inc :{balance: -amount}}).session(session)
    await Account.updateOne({
        userId:to
    },{$inc :{balance: amount}}).session(session);


await session.commitTransaction();
console.log("done")
res.json({
    message:"transfer successfull"
})
})


export default router;
