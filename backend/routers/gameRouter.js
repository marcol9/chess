import { json, Router } from "express";
const router = Router();
import { Chess } from 'chess.js'

const chess = new Chess()


router.post("/move", async(req,res)=>{
    const from = req.body.from;
    const to = req.body.to;
    const move = chess.move(req.body)
    console.log(chess.ascii());
    if(move===null){
        res.send({undefined})
        return
    }
    const response={
        inCheck: chess.in_check(),
        inCheckmate: chess.in_checkmate(),
        inStalemate: chess.in_stalemate(),
        inDraw: chess.in_draw(),
        inThreeFoldRep: chess.in_threefold_repetition(),
        insMaterial: chess.insufficient_material(),
        flags: move.flags
    }
    res.send(move);
});

export default router;