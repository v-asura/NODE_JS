const express=require("express");
const app=express();

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




app.listen(3000,()=>{
  console.log("Node Js has started at port:" + 3000);
})