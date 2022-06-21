<script>
  import { apiurl } from "../constants/apiurl.js";
  import { savedPosition } from "../store/loggedin.js";
  import { onMount } from "svelte";
  import toastr from "../components/toastrConfig.js";
  let data = { from: null, to: null, promotion: "q" };

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  let gameId = params.token; // "some_value"
  let color = params.color;
  let isYourTurn = color === "W";
  let isGameOverByDecision = false;

  import io from "socket.io-client";
  const socket = io("http://localhost:4000");

  socket.emit("join-game", gameId);
  socket.on("receive-move", (response) => {
    console.log("received move: " + JSON.stringify(response));
    handleVisualisation(response);
    isYourTurn = !isYourTurn;
  });
  socket.on("opponent-resigned", (winner) => {
    isGameOverByDecision = true
    resignSound.play();
    toastr["success"](winner + " has won by resignation");
  });

  let columns = [];
  let step;
  let postion = new Array(8).fill().map(() => Array(8).fill());

  //Initializing sound effects;
  const captureSound = new Audio("sounds/capture.mp3");
  const castleSound = new Audio("sounds/castle.mp3");
  const checkSound = new Audio("sounds/check.mp3");
  const checkmateSound = new Audio("sounds/checkmate.mp3");
  const moveSound = new Audio("sounds/move.mp3");
  const promotionSound = new Audio("sounds/promotion.mp3");
  const errorSound = new Audio("sounds/error.mp3");
  const resignSound = new Audio("sounds/resign.mp3");

  //Black pieces are lower case. White pieces are upper case
  const start = "chess_pieces/";

  const t = start + "transparent.png";

  const b = start + "Bbishop.png";
  const k = start + "Bking.png";
  const n = start + "Bknight.png";
  const p = start + "Bpawn.png";
  const q = start + "Bqueen.png";
  const r = start + "Brook.png";

  const B = start + "Wbishop.png";
  const K = start + "Wking.png";
  const N = start + "Wknight.png";
  const P = start + "Wpawn.png";
  const Q = start + "Wqueen.png";
  const R = start + "Wrook.png";

  onMount(() => {
    if (color == "W") {
      columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
      step = 8;
    }
    if (color == "B") {
      columns = ["h", "g", "f", "e", "d", "c", "b", "a"];
      step = -1;
    }
    if ($savedPosition.length === 0) {
      generateStartingPosition();
      savedPosition.set(postion);
    } else {
      postion = $savedPosition;
    }
  });

  function generateStartingPosition() {
    //Grandmaster Hikaru Nakamura calls "free" pieces (ones that can be taken without consequences) juicers.
    //Im gonna call all major pieces that way here (every kind of piece but pawn).

    const yourJuicers = postion[7];
    const opponentsJuicers = postion[0];

    if (color === "W") {
      yourJuicers[0] = yourJuicers[7] = R;
      yourJuicers[1] = yourJuicers[6] = N;
      yourJuicers[2] = yourJuicers[5] = B;
      yourJuicers[3] = Q;
      yourJuicers[4] = K;

      opponentsJuicers[0] = opponentsJuicers[7] = r;
      opponentsJuicers[1] = opponentsJuicers[6] = n;
      opponentsJuicers[2] = opponentsJuicers[5] = b;
      opponentsJuicers[3] = q;
      opponentsJuicers[4] = k;
    }
    if (color === "B") {
      yourJuicers[0] = yourJuicers[7] = r;
      yourJuicers[1] = yourJuicers[6] = n;
      yourJuicers[2] = yourJuicers[5] = b;
      yourJuicers[3] = k;
      yourJuicers[4] = q;

      opponentsJuicers[0] = opponentsJuicers[7] = R;
      opponentsJuicers[1] = opponentsJuicers[6] = N;
      opponentsJuicers[2] = opponentsJuicers[5] = B;
      opponentsJuicers[3] = K;
      opponentsJuicers[4] = Q;
    }

    //fill with white pawns
    postion[Math.abs(1 - step) - 1].fill(P);

    //fill with black pawns
    postion[Math.abs(step - 6) - 1].fill(p);

    //I have to update the variable postion somehow so that svelte sees it and updates it.
    postion = postion;
  }

  async function handleMove(move) {
    if (!isYourTurn) {
      return;
    }
    if (data.from === null) {
      data.from = move;
      return;
    }
    data.to = move;

    const moveResponse = await fetch(apiurl + "/move", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        return res;
      });
    data.from = null;
    data.to = null;
    if (moveResponse.message === undefined) {
      handleVisualisation(moveResponse);
      socket.emit("move", moveResponse, gameId);
      isYourTurn = !isYourTurn;
    } else {
      errorSound.play();
    }
  }

  function handleVisualisation(move) {
    const multiplyer = color === "B" ? 1 : -1;
    let finalSoundEffect = moveSound;

    const from = {
      y: step + multiplyer * parseInt(move.from.charAt(1)),
      x: columns.indexOf(move.from.charAt(0)),
    };

    const to = {
      y: step + multiplyer * parseInt(move.to.charAt(1)),
      x: columns.indexOf(move.to.charAt(0)),
    };

    postion[to.y][to.x] = postion[from.y][from.x];
    postion[from.y][from.x] = undefined;

    if (move.flags.includes("e")) {
      const enPassantDirection = move.color.toUpperCase() === color ? 1 : -1;
      postion[to.y + enPassantDirection][to.x] = undefined;
      finalSoundEffect = captureSound;
    }

    if (move.flags.includes("c")) {
      finalSoundEffect = captureSound;
    }

    if (move.flags.includes("p")) {
      switch (move.promotion) {
        case "q":
          postion[to.y][to.x] = move.color === "b" ? q : Q;
          break;
        case "n":
          postion[to.y][to.x] = move.color === "b" ? n : N;
          break;
        case "r":
          postion[to.y][to.x] = move.color === "b" ? r : R;
          break;
        case "b":
          postion[to.y][to.x] = move.color === "b" ? b : B;
          break;
      }
      finalSoundEffect = promotionSound;
    }

    if (move.flags.includes("k")) {
      switch (color) {
        case "W":
          postion[to.y][7] = undefined;
          postion[to.y][5] = move.color === "b" ? r : R;
          break;
        case "B":
          postion[to.y][0] = undefined;
          postion[to.y][2] = move.color === "b" ? r : R;
          break;
      }
      finalSoundEffect = castleSound;
    }
    if (move.flags.includes("q")) {
      switch (color) {
        case "W":
          postion[to.y][0] = undefined;
          postion[to.y][3] = move.color === "b" ? r : R;
          break;
        case "B":
          postion[to.y][7] = undefined;
          postion[to.y][4] = move.color === "b" ? r : R;
          break;
      }

      finalSoundEffect = castleSound;
    }

    if (move.inCheck) {
      finalSoundEffect = checkSound;
    }

    if (move.inCheckmate) {
      savedPosition.set([]);
      const winner = move.color === "b" ? "Black" : "White";
      toastr["success"](winner + "has won by checkmate.");
      checkmateSound.play();
      return;
    }

    if (move.inDraw) {
      savedPosition.set([]);
      if (move.inStalemate) {
        toastr["success"]("There has been a draw due to stalemate");
      }
      if (move.insMaterial) {
        toastr["success"]("There has been a draw due to insufitient material");
      }
      if (move.inThreeFoldRep) {
        toastr["success"]("There has been a draw due to three fold repetiton");
      }
      return;
    }

    finalSoundEffect.play();
    postion = postion;
    savedPosition.set(postion);
  }

  function getColor(x, y) {
    if ((x + y) % 2 == 0) {
      return "white";
    }
    return "black";
  }

  function resign() {
    if(isGameOverByDecision){return;}
    const winner = color === "B" ? "White" : "Black";
    socket.emit("resign", winner, gameId);
    resignSound.play();
    toastr["success"](winner + " has won by resignation");
  }

  //FOR TESTING PURPOSEES ONLY DELTE
  function clear() {
    $savedPosition = [];
  }
</script>

<div class="game">

  <div class="chessboard">
    <div class="board">
      {#each Array(8) as _, index (index)}
        <div class="row">
          {Math.abs(step - index)}{" _"}
          {#each columns as letter, i}
            <div
              class="square {getColor(index, i)}"
              tabindex="0"
              on:click={() => handleMove(letter + Math.abs(step - index))}
            />
          {/each}
        </div>
      {/each}
      <div class="letters">
        {#each columns as letter}
          <div class="letter">{letter}</div>
        {/each}
      </div>
    </div>

    <div class="visualisation">
      {#each postion as row}
        <div class="row">
          {#each row as square}
            <div class="visual-square">
              {#if square === undefined || square === null}
                <img class="visual-piece" src={t} alt="" />
              {:else}
                <img class="visual-piece" src={square} alt="" />
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <div class="options">
    <div class="promotion container">
      <label for="promotion">Promotion:</label>
      <select id="promotion" bind:value={data.promotion}>
        <option value="q">♕ Queen</option>
        <option value="n">♘ Knight</option>
        <option value="r">♖ Rook</option>
        <option value="b">♗ Bishop</option>
      </select>
    </div>

    <div class="options-buttons">
      <!-- for testing purposes only -->
      <button on:click={() => clear()}>Clear</button>

      <button on:click|once={resign}>Resign</button>
      <button>Offer Draw</button>
    </div>
  </div>
</div>

<style>
  .chessboard {
    width: 700px;
    height: 600px;
    position: relative;
    margin-left: 10%;
  }

  .options {
    /* margin-left: 700px;
    margin-top: -350px; */
    margin-top: 30px;
  }
  
  .board {
    position: absolute;
    min-width: 700px;
    min-height: 600px;
    margin-left: 25%;
    font-size: 20px;
  }
  .visualisation {
    position: absolute;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
    pointer-events: none;
    min-width: 700px;
    min-height: 600px;
    margin-left: 27%;
  }

  .letters {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .letter {
    padding-left: 10px;
    width: 75px;
    height: 75px;
  }
  label {
    font-size: 20px;
  }

  option {
    font-size: 20px;
  }
  select {
    font-size: 20px;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .square {
    cursor: pointer;
    width: 75px;
    height: 75px;
  }

  .visual-square {
    width: 75px;
    height: 75px;
  }

  .visual-piece {
    width: 75px;
    height: 75px;
  }

  .black {
    background-color: #769656;
  }
  .white {
    background-color: #eeeed2;
  }
  .square:hover {
    background-color: rgba(163, 6, 6, 0.47);
  }
  .square:focus {
    background-color: rgba(163, 6, 6, 0.701);
  }
</style>
