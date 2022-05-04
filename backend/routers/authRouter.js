import Router, { json } from "express";
const router = Router();
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
 import { mailer } from "../public/mailer.js";
 import { db } from "../database/Connection.js";


//session requires express-session package
router.post("/login", async (req, res) => {
  const user = await db.get("SELECT password,email,role FROM users WHERE email=?", [req.body.email]);
  if (user == null) {
    return res.status(401).send({ message: "Cannot find user with this email" });
  }
  try {
    bcrypt.compare(req.body.password, user.password, (err, same) => {
      if (same) {
        const acessToken = jwt.sign(user, process.env.ACESS_TOKEN_SECRET, { expiresIn: "1d" });
        res.cookie("jwt", acessToken, {
          maxAge: 24 * 60 * 60 * 1000, //1 day,
        });
        res.send({
          message: "Sucess",
        });
      } else {
        res.status(401).send({
          message: "Wrong password",
        });
      }
    });
  } catch {
    res.status(500).send();
  }
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, process.env.ACESS_TOKEN_SECRET);
    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
    const user = await db.get("SELECT username,password,email,role FROM users WHERE email=?", [claims.email]);
    //const user = users.find((user) => user.email === claims.email);
    res.json(user);
  } catch (e) {
    return res.status(401).send({
      message: "Unauthenticated",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.run("INSERT INTO users (username,password,email,role) VALUES(?,?,?,?)", [req.body.username, hashedPassword, req.body.email, "customer"]);
    mailer(
      req.body.email,
      "Thank you for registering",
      "Hello our new player! We are pleased to welcome you at the chess. Happy chessing!",
      ""
    ).catch(console.error);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

router.post("/reset-password-email", async (req, res) => {
  const token = nanoid(); //=> "V1StGXR8_Z5jdHi6B-myT"
  const email = req.body.email;
  const foundUser = await db.get("SELECT email FROM users WHERE email=?", [email]);
  if (foundUser == null) {
    return res.status(401).send({ message: "Can't find user with this email" });
  }
  await db.run("UPDATE users SET token = ? WHERE email = ?", [token, email]);

  mailer(
    foundUser.email,
    "Your password reset link",
    "",
    '<p>You requested for reset password, kindly use this <a href="http://localhost:8080/reset-password?token=' +
      token +
      '">link</a> to reset your password</p>'
  );
  res.status(201).send({ message: "email has been sent successfully" });
});

router.post("/reset-password", async (req, res) => {
  const token = req.query.token;
  const foundUser = await db.get("SELECT email FROM users WHERE token=?", [token]);

  if (foundUser == null) {
    return res.status(401).send({ message: "Can't find user with this restore token" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await db.run("UPDATE users SET password = ? WHERE token = ?", [hashedPassword, token]);
  await db.run("UPDATE users SET token = null WHERE token = ?", [token]);

  res.status(201).send({ message: "The password has been changed successfully" });
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.send({
    message: "Success",
  });
});

export default router;
