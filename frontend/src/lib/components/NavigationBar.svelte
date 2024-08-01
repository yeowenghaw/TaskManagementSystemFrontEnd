<script>
  import axios from "axios";
  import { goto } from "$app/navigation";
  export let data;
  let isloggedin = false;
  let isadmin = true;
  //import { navigating } from "$app/stores";

  $: {
    if (data) {
      //console.log(data);
      if ("token" in data) {
        isloggedin = true;
      } else {
        isloggedin = false;
      }
    }
    //   //console.log(data);
    // }
    // if (navigating) {
    //   if ("token" in data) {
    //     isloggedin = true;
    //   } else {
    //     isloggedin = false;
    //   }
    //   console.log("navigating");
    // }
  }

  const handleLogout = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/logout",
        withCredentials: true
      });

      console.log(response);

      if (response.status === 200) {
        // Check for successful response status
        goto("/login");
      } else {
        console.error("Logout failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error.response || error.message);
    }
  };
</script>

<div class="navbar">
  {#if isloggedin === true}
    <a href="/" data-sveltekit-reload>Home</a>
  {:else}
    <a href="/login" data-sveltekit-reload>Home</a>
  {/if}

  {#if isloggedin === true}
    <a href="/profile" data-sveltekit-reload>Profile</a>
    {#if isadmin === true}
      <a href="/usermanagement" data-sveltekit-reload>UserManagement</a>
    {/if}
    <div class="right">
      <button on:click={handleLogout} class="nav-button" navigating>Log Out</button>
    </div>
  {/if}
</div>

<style>
  /* Basic styling for the navigation bar */
  .navbar {
    background-color: #333;
    overflow: hidden;
  }
  .navbar a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }
  .navbar a:hover {
    background-color: #ddd;
    color: black;
  }
  .navbar .right {
    float: right;
  }
  /* Style for the button to match the navigation links */
  .nav-button {
    background: none; /* No background */
    border: none; /* Remove border */
    color: #f2f2f2; /* Text color */
    text-align: center;
    padding: 14px 16px;
    font-size: 17px;
    cursor: pointer;
    text-decoration: none; /* Remove underline */
  }
  .nav-button:hover {
    background-color: #ddd; /* Match hover effect */
    color: black;
  }
</style>
