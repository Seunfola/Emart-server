require("dotenv").config();

require("./config/database").connect();

const cors = require("cors");

const express = require("express");

const { default: Stripe } = require("stripe");

const User = require("./model/user");

const auth = require("./middleware/auth");

const jwt = require("jsonwebtoken");

const app = express();

const bcrypt = require("bcryptjs");
const { generateAuthToken } = require("./utils/jwt.util");

const stripe = new Stripe(process.env.STRIPE_API_KEY);

app.use(express.json());

app.use(cors());
// Logic goes here


app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome to the Page");
});
//stripe check
app.get('/health-check', async (req, res) => {
  console.log('Request Received');
  const isStripeUp = await fetch('https://api.stripe.com/healthcheck').then((res) => res.statusText);
  console.log(isStripeUp);
  res.send({
    status: isStripeUp
  });
})

// Login

app.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { user_name, password } = req.body;

    // Validate user input
    if (!(user_name && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ user_name });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' })


    // Create token
    const token = generateAuthToken({ _id: user._id })

    // save user token
    user.token = token;

    // user
    res.status(200).json(user);

  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Register

app.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, phone_number, user_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name && user_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      ...req.body,
      email: email.toLowerCase(),
      // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = generateAuthToken({ _id: user._id })

    // save user token
    user.token = token;

    // return new user
    const obscuredUser = user.toObject()
    delete obscuredUser.password;

    res.status(201).json(obscuredUser);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

module.exports = app;
