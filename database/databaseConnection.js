const mongoose=require("mongoose")


 const  connectToDb=async ()=>{
   await mongoose.connect("mongodb+srv://ravsau00:acesNode@cluster0.lppqle3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
   console.log("Database connected");
}
module.exports=connectToDb