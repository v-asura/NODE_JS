const mongoose=require("mongoose");
const schema=mongoose.Schema;

const blogSchema=new schema ({
    title:{
        type:String
    },
    subtitle:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
});

const Blog=mongoose.model("Blog",blogSchema)

module.exports=Blog;