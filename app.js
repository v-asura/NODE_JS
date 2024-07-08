const express=require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectToDb();

app.set('view engine','ejs')

app.get("/",(req,res)=>{
  res.send("<h1>This is Homepage</h1>")
})

app.get("/about",(req,res)=>{
  const name="Sau Rav"
  res.render("about.ejs",{name:name})
})

app.get("/contact",(req,res)=>{
   res.render("contact.ejs")
})

app.get("/createblog",(req,res)=>{
  res.render("createblog.ejs")
})

app.post("/createblog",async (req,res)=>{
  console.log(req.body)
  const{title,subtitle,description}=req.body;
  console.log(title,subtitle,description);
  await Blog.create({
    title:title,
    subtitle:subtitle,
    description:description,
  })
  res.send("blog created successfully")
})


app.listen(3000,()=>{
  console.log("Node Js has started at port:" + 3000);
})