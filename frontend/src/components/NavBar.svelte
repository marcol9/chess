<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Login from "../pages/Login.svelte";
  import { loggedin } from "../store/loggedin";
  import { apiurl, weburl } from "../constants/apiurl.js";
  import Register from "../pages/Register.svelte";
  import ResetPassEmail from "../pages/ResetPassEmail.svelte";
  import ResetPassword from "../pages/ResetPassword.svelte";

  export let role;
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
            {#if role == "admin"}
              <li class="nav-item dropdown  text-link">
                <a class="nav-link dropdown-toggle" id="dropdown09" data-bs-toggle="dropdown" aria-expanded="false">Manage items</a>
                <ul class="dropdown-menu" aria-labelledby="dropdown09">
                  <li><Link to="/admin/add-item"><a class="dropdown-item" href="/admin/add-item">Admin item 1</a></Link></li>
                  <li><Link to="/admin/view-items"><a class="dropdown-item" href="/admin/view-items">Admin item 2</a></Link></li>
                </ul>
              </li>

              <li class="nav-item  text-link">
                <Link to="/admin/manage-orders">
                  <a class="nav-link" href="/admin/manage-orders">item 1</a>
                </Link>
              </li>
            {:else}
              <li class="nav-item text-link">
                <Link to="/view-items-category?category=pcs-and-laptops">
                  <a class="nav-link" href="/view-items-category">item 2</a>
                </Link>
              </li>
              <li class="nav-item  text-link">
                <a class="nav-link" href="/rest">item 3</a>
              </li>
              <li class="nav-item  text-link">
                <a class="nav-link" href="/ssr">item 4</a>
              </li>
              <li class="nav-item  text-link">
                <a class="nav-link" href="/ssr">item 5</a>
              </li>
            {/if}
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
  .dropdown-item {
    color: rgba(0, 0, 0, 0.55);
  }
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
