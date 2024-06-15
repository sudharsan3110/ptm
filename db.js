import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost:27017/paytm");
const userSchema = new mongoose.Schema({
    userName :String,
    firstName:String,
    lastName: String,
    password: String
})


const accountSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance: {
        type:Number,
        required:true
    }
})
const Account = mongoose.model('Account',accountSchema);

const User = mongoose.model("User", userSchema);

const db = {Account,User};

export default db;