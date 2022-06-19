<script>
  import { apiurl,} from "../constants/apiurl.js";
    import { onMount } from "svelte";
    let data = {from:null,to:null,promotion:"q"}
    let finalRes;
    export let color;
    let columns = [];
    let step; 

    function handleMove(move){
        if(data.from===null){
            data.from = move;
            return
        }
        data.to = move

        fetch(apiurl + "/move", {
            method: "POST", 
            credentials: "include", 
            headers: {
                "Content-Type": "application/json",},
            body: JSON.stringify(data),
        }).then((response) => {
        return response.json();
        }).then((res) => {
        finalRes = res;
        return finalRes;
      });
      data.from = null;
      data.to = null;
    }

    function getColor(x,y){
        if ((x + y) % 2 == 0) { return "white"}
        return "black"
    }

    onMount(()=>{
        if(color === 'W'){
           columns = ['a','b','c','d','e','f','g','h'];
           step = 8;
        }
        if(color === 'B'){
            columns = ['h','g','f','e','d','c','b','a'];
            step = -1;
        }

    });
</script>

<div class="board">
{#each Array(8) as _, index (index)}
    <div class="row"> 
    {Math.abs(step-index)}{" _"}
    {#each columns as letter, i}
        <div class = "square {getColor(index, i)}" on:click={() => handleMove(letter+Math.abs(step-index))}>
        </div>
    {/each}
    </div>
{/each}
    <div class="letters">
        {#each columns as letter}
        <div class = "letter">{letter}</div>
        {/each}
    </div>
</div>
<div class="promotion container">
    <label for="promotion">Promotion:</label>
    <select id="promotion" bind:value={data.promotion}>
        <option value="q">♕ Queen</option>
        <option value="n">♘ Knight</option>
        <option value="r">♖ Rook</option>
        <option value="b">♗ Bishop</option>
    </select>
</div>


<style>
    
    .board{
        min-width: 700px;
        min-height: 600px;
        margin-left: 25%;
        font-size: 20px;

    }

    .letters{
        display: flex;
        flex-direction: row;
        align-items: center;;
    }

    .letter{
        padding-left: 10px;
        width: 75px;
        height: 75px;
    }
    label{
        font-size: 20px;
    }

    option{
        font-size: 20px;
    }
    select{
        font-size: 20px;
    }
  
  .row{
        display: flex;
        flex-direction: row;
        align-items: center;;
    }
    .square{
        cursor: pointer;
        width: 75px;
        height: 75px;
    }
    .black{
        background-color:#769656;
    }
    .white{
        background-color: #eeeed2;
    }
    .square:hover {
        background-color: rgba(163, 6, 6, 0.6);
    }

</style>
