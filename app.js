const express=require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const app=express();

const {multer,storage}=require('./middleware/multerConfig');
const upload=multer({storage:storage});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectToDb();

app.use(express.static("./images"))
app.set('view engine','ejs')

app.get("/",async (req,res)=>{
  const blogs=await Blog.find()    //return array
  res.render("home.ejs",{blogs:blogs})
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


app.post("/createblog",upload.single('image'),async (req,res)=>{
  // console.log(req.body)
  const fileName=req.file.filename;
  
  const{title,subtitle,description}=req.body;
  console.log(title,subtitle,description);
  await Blog.create({
    title:title,
    subtitle:subtitle,
    description:description,
    image:fileName
  })
  res.send("blog created successfully")
})


app.listen(3000,()=>{
  console.log("Node Js has started at port:" + 3000);
})