<script>
  import { onMount } from "svelte";
  import NavBar from "./components/NavBar.svelte";
  import Chessboard from "./components/Chessboard.svelte";
  import { apiurl } from "./constants/apiurl";
  import { loggedin } from "./store/loggedin";

  let username = "";
  let role = "";
  let ok = false;
  let color = 'B';

  onMount(() => {
    fetch(apiurl + "/user", {
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          ok = true;
        }
        return res.json();
      })
      .then((resJson) => {
        if (ok) {
          const content = resJson;
          username = content.username;
          role = content.role;
          loggedin.set(true);
        } else {
          loggedin.set(false);
        }
      });
  });
</script>

<main>
  <Chessboard {color}/>
</main>
