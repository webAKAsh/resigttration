import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb://localhost:27017/loginPage",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({email:email}, (err,user) => {
        if(user){
            if(password === user.password){
                res.send({message:"Login Successfull", user: user})
            } else {
                res.send({message: "Password didnot match"})
            }
        } else {
            res.send({message : "User not found"})
        }
    })
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Resgistered ,Please login now" });
        }
      });
    }
  });
});

app.listen(9002, () => {
  console.log("DB listen on 9002");
});
