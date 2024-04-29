const express = require("express");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const { usermodel } = require("../model/user.model");

/**
 * @swagger
 * /users:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
userRouter.get("/", async (req, res) => {
  try {
    const users = await usermodel.find();
    res.status(200).send(users);
  } catch (err) {
    res.send("not found");
  }
});
/**
 * @swagger
 * /users/Register:
 *   post:
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: A new user is sucessfully registered.
 *       400:
 *         description: name and email and password is required.
 *       500:
 *         description: Internal Server Error.
 */
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(username);
    console.log(email);
    console.log(password);

    if (!username || !email || !password) {
      return res
        .status(400)
        .send("Username, email, and password are required.");
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newuser = new usermodel({ username, email, password: hash, role });
    await newuser.save();
    res.status(201).send({ msg: `User registered successfully`, newuser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     description: login a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: user is sucessfully login.
 *       401:
 *         description: wrong password.
 *       500:
 *         description: Internal Server Error.
 */

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).send({ msg: "Login success", token });
    } else {
      return res.status(401).send("Wrong password");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * /users/login:
 *   delete:
 *     description: delete a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: user is sucessfully login.
 *       500:
 *         description: Internal Server Error.
 */

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await usermodel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    return res
      .status(200)
      .send({ msg: "User deleted successfully", deletedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = userRouter;

// {
//     "title": "task 1",
//     "body": "create a vite app"
// }

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJmNzVjZmZiZjM5NGI2ZjY4YWQ4ZWQiLCJ1c2VybmFtZSI6InJvaGFuIiwiaWF0IjoxNzE0Mzg4MzgwLCJleHAiOjE3MTQzOTE5ODB9.uCQeR6sUgB9urVjkqf4KvaNUAfY0V0qhwXg5_lvEdyE
