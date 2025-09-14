const mongoose=require('mongoose');
 const subjectSchema= new mongoose.Schema({
       department: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      type: String,
      required: true,
    },
  ],
}, { timestamps: true });
 

 module.exports=mongoose.model('Subject',subjectSchema)