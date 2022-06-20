<script>
  import { onMount } from "svelte";
  import { apiurl } from "../constants/apiurl";
  import { navigate } from "svelte-navigator";
  import { loggedin } from "../store/loggedin";

  let username = "";
  let role = "";
  let ok = false;

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
          if (role !== "admin" || "user") {
            navigate("/login");
          }
        }
      });
  });
</script>
