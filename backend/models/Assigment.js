const mongoose=require('mongoose')

const assigmentModel=new mongoose.Schema({
    title:String,
    descriptions:String,
    subjects:String
})