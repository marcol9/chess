<script>
  import toastr from "toastr";
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "1000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
  import { apiurl, weburl } from "../constants/apiurl.js";
  import PrivateRouteGuard from "../components/PrivateRouteGuard.svelte";

  let data = {
    email: "",
  };
  function sendInvite(data) {
    console.log(data);
    fetch(apiurl + "/invite", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then((response) => {
        const status = response.status;

        switch (status) {
          case 201:
            toastr["success"]("Invite sent succesfully");

            break;
          case 429:
            toastr["warning"]("Too many attempts, try again later");
            break;
          default:
            toastr["error"]("Something went wrong, contact admin on try again later");
        }
        return response.json();
      })
      .then((resJson) => {
        setTimeout(() => {
          window.location.href = resJson.link;
        }, 1500);
      });
  }
</script>

<PrivateRouteGuard />
<main class="form-signin">
  <form>
    <img class="mb-4" src="logo.png" alt="" width="60" height="66" />
    <h1 class="h3 mb-3 fw-normal">Send an invite</h1>
    <div class="form-floating">
      <input bind:value={data.email} type="email" class="form-control" id="floatingInput" placeholder="name@example.com" />
      <label for="floatingInput">Email address</label>
    </div>
    <button on:click|preventDefault={() => sendInvite(data)} class="w-100 btn btn-lg btn-primary" type="submit">Send email</button>
    <p class="mt-5 mb-3 text-muted">&copy; 2022</p>
  </form>
</main>

<style>
  .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
  }

  .form-signin .form-floating:focus-within {
    z-index: 2;
  }

  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
