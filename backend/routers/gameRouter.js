import { json, Router } from "express";
const router = Router();
import { Chess, EMPTY } from "chess.js";
import { nanoid } from "nanoid";
import { mailer } from "../public/mailer.js";

import http from "http";
const server = http.createServer(router);

import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
  },
});
io.on("connection", (socket) => {
  socket.on("move", (move, room) => {
    socket.to(room).emit("receive-move", move);
  });
  socket.on("join-game", (gameId) => {
    socket.join(gameId);
  });
  socket.on("resign", (winner,room)=>{
    if(chess.game_over()){return}
    chess.load('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78');
    socket.to(room).emit("opponent-resigned", winner)
  })
});
server.listen(4000);

const chess = new Chess();

router.post("/invite", async (req, res) => {
  const token = nanoid(); //=> "V1StGXR8_Z5jdHi6B-myT"
  const email = req.body.email;
  // mailer(
  //   email,
  //   "Your chess invite",
  //   "",
  //   '<p>You have been invited to the chess game, kindly use this <a href="http://localhost:8080/game?token=' +
  //     token +
  //     "&color=B" +
  //     '">link</a> to enter the game</p>'
  // );
  res.status(201).send({ link: "http://localhost:8080/game?token=" + token + "&color=W" });
});

router.post("/move", async (req, res) => {
  const move = chess.move(req.body);
  console.log(chess.ascii());
  if (move === null) {
    res.send({ message: "Invalid move" });
    return;
  }
  const response = {
    from: move.from,
    to: move.to,
    inCheck: chess.in_check(),
    inCheckmate: chess.in_checkmate(),
    inStalemate: chess.in_stalemate(),
    inDraw: chess.in_draw(),
    inThreeFoldRep: chess.in_threefold_repetition(),
    insMaterial: chess.insufficient_material(),
    flags: move.flags,
    color: move.color,
    promotion: move.promotion
  };
  res.send(response);
});

router.get("/current");

export default router;
