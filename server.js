const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
var USER="";
mongoose.connect('mongodb://localhost:27017/auticheck', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSignup = new mongoose.Schema({
    name: String,
    email: String,
    PhoneNumber: Number,
    age : Number,
    password: String
});


const Bio_data = new mongoose.Schema({
  question1: String,
  question2: String,
  question3: String,
  question4: String,
  question5: String,
  question6: String,
  question7: String,
  question8: String,
  question9: String,
  question10: String
});

const feedback = new mongoose.Schema({
  email: String,
  title: String,
  author:String,
  summary: String
});

const Summary = new mongoose.model("Summary",feedback);


const Student_UserDetails = new mongoose.model("Student_Details",userSignup);

const Doctor_UserDetails = new mongoose.model("Doctor_Details",userSignup);

const bio_data_details = new mongoose.model("User_Bio_data",Bio_data);

app.use(bodyParser.urlencoded({extended:true}));

app.get("",function(req,res){
    res.sendFile(__dirname + "/public/main1.html");
});
var mail = "";

app.post("/student_register",async(req,res)=>{
  try{
      const check_mail = req.body.email;
      const check_number = req.body.PhoneNumber;
      const cnumber = req.body.Conform_number;
      const user = await Student_UserDetails.findOne({email:check_mail},{PhoneNumber: check_number});
      if(!user){
        const encryptedString = cryptr.encrypt(req.body.password);
        const userDetails = new Student_UserDetails({
          name: req.body.Name,
          email: req.body.email,
          PhoneNumber: req.body.PhoneNumber,
          age : req.body.Age,
          password: encryptedString
         });
        userDetails.save();
        USER = req.body.email;
        // UUa = req.body.name;
        // res.send("Success");
        res.render('student_dashboard',{name:USER});
      }
      else{
        res.status(201).send("<body style='background-color:white;color:white;text-align:center;'><h2>This user already exists</h2></body>");
      }
    }
    catch(error){
      console.log(error);
      // res.send("Invalid details");
    }
});


// app.post("/student_biodata",async(req,res)=>{
//   try{
//   const email = req.body.email;
//     const user = await Student_UserDetails.findOne({email: email});
//     if(user){
//       res.render('student_biodata', {
//         name: user.name,
//         email: user.email,
//         PhoneNumber: user.PhoneNumber,
//         age: user.age
//       });
//     }else{
//       res.send("User not found");
//     }
//   }catch(error){
//     res.send(error);
//   }
//   catch(error){
//     console.log(error);
//   }
// }


app.post("/doctor_register",async(req,res)=>{
  try{
      const check_mail = req.body.email;
      const check_number = req.body.PhoneNumber;
      const cnumber = req.body.Conform_number;
      const user = await Doctor_UserDetails.findOne({email:check_mail},{PhoneNumber: check_number});
      if(!user){
        const encryptedString = cryptr.encrypt(req.body.password);
        const userDetails = new Doctor_UserDetails({
          name: req.body.Name,
          email: req.body.email,
          PhoneNumber: req.body.PhoneNumber,
          age : req.body.Age,
          password: encryptedString
         });
        userDetails.save();
        USER = req.body.email;
        mail = USER;
        // const student = {
        //   name: "af",
        //   email: "asflkjfa"
        // }
        UUa = req.body.name;
        // res.send("Success");
        res.send(__dirname+"/views/doctor_dashboard.html");
      }
      else{
        res.status(201).send("<body style='background-color:white;color:white;text-align:center;'><h2>This user already exists</h2></body>");
      }
    }
    catch(error){
      console.log(error);
      // res.send("Invalid details");
    }
});

app.get("/biodata",(req,res)=>{
  try{
    res.render('biodata')
  }
  catch(error){

  }
})



app.post('/submit_summary',async(req,res)=>{
  try{
    const title = req.body.title;
    const author = req.body.author;
    const summary = req.body.summary;
    const SUMMARY = new Summary({
      email: USER,
      title: title,
      author: author,
      summary: summary
    })
    SUMMARY.save();
    res.render('book',{name:USER});
  }
  catch(error){
    res.send(error);
  }
});

app.post('/back',(req,res)=>{
  res.sendFile(__dirname+"/public/main1.html");
})

app.post("/student_dashboard",async(req,res)=>{
  const USER = "Yaswanth"
  res.render('student_dashboard',{USER});
});

app.post("/point",async(req,res)=>{
  res.render('points',{point: POINT});
})

app.get("/hh",async(req,res)=>{
  res.render('payment');
})

app.post("/student_login",async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        // const name = await UserDetails.findMany({})
        const useremail = await Student_UserDetails.findOne({email: email});
        if(useremail){
          const decryptedString = cryptr.decrypt(useremail.password);
          if(decryptedString === password){
            // res.status(201).sendFile(__dirname+"/Public/Html_pages/sign/digisign.html");
            // res.send("Success");
            USER = email;
            res.render('student_dashboard',{name:USER});
          }
          else{
            res.send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
          }
        }
        else{
          res.send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
        }
      }
      catch(error){
        res.status(400).send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
      }
});

app.post("/doctor_login",async(req,res)=>{
  try {
      const email = req.body.email;
      const password = req.body.password;
      // const name = await UserDetails.findMany({})
      const useremail = await Doctor_UserDetails.findOne({email: email});
      if(useremail){
        const decryptedString = cryptr.decrypt(useremail.password);
        if(decryptedString === password){
          // res.status(201).sendFile(__dirname+"/Public/Html_pages/sign/digisign.html");
          // res.send("Success");
          USER = email;
          res.sendFile(__dirname + "/views/doctor_dashboard.html");
        }
        else{
          res.send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
        }
      }
      else{
        res.send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
      }
    }
    catch(error){
      res.status(400).send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
    }
});

app.post('/student_biodata',async(req,res)=>{
  try{
    res.render('biodata');
  }
  catch(error){
    console.log(error);
  }
});

app.post('/read',async(req,res)=>{
  res.render('read');
});

app.post('/bio_data',async(req,res)=>{
  try{
    const question1 = req.body.answer1;
    const question2 = req.body.answer2;
    const question3 = req.body.answer3;
    const question4 = req.body.answer4;
    const question5 = req.body.answer5;
    const question6 = req.body.answer6;
    const question7 = req.body.answer7;
    const question8 = req.body.answer8;
    const question9 = req.body.answer9;
    const question10 = req.body.answer10;
    const bio_details = new bio_data_details({
      email: USER,
      question1: question1,
      question2: question2,
      question3: question3,
      question4: question4,
      question5: question5,
      question6: question6,
      question7: question7,
      question8: question8,
      question9: question9,
      question10: question10
    })
    bio_details.save();
    res.render('student_dashboard',{name:USER});
  }
  catch(error){
    console.log(error);
  }
});

app.listen(8080,function(req,res){
    console.log("You website is running in localhost:8080");
});
