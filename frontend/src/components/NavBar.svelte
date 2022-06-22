<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Login from "../pages/Login.svelte";
  import { loggedin } from "../store/loggedin";
  import { apiurl, weburl } from "../constants/apiurl.js";
  import Register from "../pages/Register.svelte";
  import ResetPassEmail from "../pages/ResetPassEmail.svelte";
  import ResetPassword from "../pages/ResetPassword.svelte";
  import NewGame from "../pages/NewGame.svelte";
  import Game from "../pages/Game.svelte";

  export let username;

  let auth = false;
  loggedin.subscribe((a) => (auth = a));
  function logOut() {
    fetch(apiurl + "/logout", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
    });
    window.location.href = "/";
  }
</script>

<Router>
  <div class="container">
    <nav class="navbar navbar-expand-sm rounded navbar-light bg-light">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <Link to="/" class="nav-link">
                <img src="logo.png" alt="" width="60" height="66" />
              </Link>
            </li>

            <li class="nav-item text-link">
              <Link to="/new-game">
                <a class="nav-link" href="/new-game">Start new game</a>
              </Link>
            </li>
          </ul>

          {#if auth == true}
            <p class="nav-link">Hi, {username}</p>
            <button
              on:click={() => {
                logOut();
              }}
              class="nav-link">Log out</button
            >
          {/if}
          {#if auth == false}
            <Link to="/login" class="nav-link "><button>Log in</button></Link>
            <Link to="/register" class="nav-link"><button>Sign up</button></Link>
          {/if}
        </div>
      </div>
    </nav>
  </div>
  <Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/resetpassemail" component={ResetPassEmail} />
  <Route path="/reset-password" component={ResetPassword} />
  <Route path="/new-game" component={NewGame} />
  <Route path="/game" component={Game} />
</Router>

<style>
  .navbar-nav {
    align-items: center;
  }
  .text-link {
    border-width: 0.8px;
    border-color: #000000;
    border-style: solid;
    border-radius: 3px;
  }
  a:hover {
    text-decoration: none;
  }
  .nav-link,

  .text-link:hover {
    background-color: rgb(235, 235, 235);
  }
  .nav-item {
    margin-right: 20px;
  }
  button,
  .nav-link {
    margin-bottom: 0px;
  }
</style>
