require("dotenv").config()

const express=require("express");
const app=express();
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const cookieParser=require('cookie-parser')
app.use(cookieParser());

const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");

const {multer,storage}=require('./middleware/multerConfig');
const User = require("./model/userModel");
const isAuthenticated = require("./middleware/isAuthenticated");
const upload=multer({storage:storage});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectToDb();

app.use(express.static("./storage"))
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

app.get("/register",(req,res)=>{
 
   res.render("register.ejs")
})

app.post("/register",async (req,res)=>{
 const {username,email,password}=req.body;
 await User.create({
  username:username,
  email:email,
  password:bcrypt.hashSync(password,12),
 })
   res.redirect("/login")
})



app.get("/login",(req,res)=>{
   res.render("login.ejs")
})


app.post("/login",async (req,res)=>{
  const {email,password}=req.body;
  const user=await User.find({email:email})
  if(user.length===0){
    res.send("Invalid email or password")
  }else{
  //  check- password
  const isMatched=bcrypt.compareSync(password,user[0].password)
  if(!isMatched){
    res.send("Invalid Password")
  }else{
    //require dotenv config file
    const token=jwt.sign({userId:user[0]._id},process.env.SECRET,{
      expiresIn:'20d'
    })
    res.cookie("token",token)
    res.send("logged in successfully")
  }
  }
 })


app.get("/blog/:id",isAuthenticated,async (req,res)=>{
  const id=req.params.id;
  const blog=await Blog.findById(id);
   res.render("blog.ejs",{blog:blog})
})


app.get("/deleteblog/:id",async (req,res)=>{
  const id=req.params.id;
  const remove=await Blog.findByIdAndDelete(id);
   res.redirect("/")
})


app.get("/editblog/:id",async (req,res)=>{
  const id=req.params.id;
  const blog=await Blog.findById(id);
   res.render("editblog",{blog:blog})
})


app.post("/editblog/:id",upload.single('image'),async (req,res)=>{
  const id=req.params.id;
  const fileName=req.file.filename;
  const {title,subtitle,description}=req.body;
  const blog=await Blog.findByIdAndUpdate(id,{
    title:title,
    subtitle:subtitle,
    description:description,
    image:fileName
  });
   res.redirect("/blog/"+id)
})


app.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
      return res.redirect("/");
  }

  const blogs = await Blog.find({
      $or: [
          { title: new RegExp(query, 'i') },
          { subtitle: new RegExp(query, 'i') },
          { description: new RegExp(query, 'i') }
      ]
  });

  res.render("search.ejs", { blogs: blogs, query: query });
});


app.get("/createblog",isAuthenticated,(req,res)=>{
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
  res.redirect("/")
})


app.listen(3000,()=>{
  console.log("Node Js has started at port:" + 3000);
})