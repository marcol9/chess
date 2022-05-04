import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const token = req.cookies["jwt"];
  if (token === null) return res.sendStatus(401).send("No token");
  jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send();
    req.user = user;
    next();
  });
}
export function checkIfAdmin(req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).send();
  }
}
