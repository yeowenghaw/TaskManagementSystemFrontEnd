<script>
  import { afterUpdate } from "svelte";
  import { onMount } from "svelte";
  import axios from "axios";
  import { goto } from "$app/navigation";
  let isloggedin = false;
  let isadmin = false;

  $: {
  }

  const handleLogout = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/auth/logout",
        withCredentials: true
      });
      if (response.status === 200) {
        // Check for successful response status
      } else {
        console.error("Logout failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error.response || error.message);
    }
    isloggedin = false;
    isadmin = false;
    goto("/login");
  };

  const handleToken = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/auth/authenticate",
        withCredentials: true
      });
      return response;
    } catch (error) {
      //console.error("Error during authentication:", error.response || error.message);
      console.log("user not authorized");
    }
  };

  afterUpdate(async () => {
    console.log("After update has been called");
    const data = await handleToken();
    //console.log(data);
    if (data) {
      if (data.status === 200) {
        if (data.data.message === "Authorized admin") {
          isloggedin = true;
          isadmin = true;
        } else {
          isloggedin = true;
          isadmin = false;
        }
      } else {
        isloggedin = false;
        isadmin = false;
        await handleLogout();
      }
      // Perform actions that depend on the updated DOM here
    }
  });

  onMount(async () => {
    // Your code here, this will run once the component is mounted
    console.log("on mount is called!");
    const data = await handleToken();
    //console.log(data);
    if (data) {
      if (data.status === 200) {
        if (data.data.message === "Authorized admin") {
          isloggedin = true;
          isadmin = true;
        } else {
          isloggedin = true;
          isadmin = false;
        }
      } else {
        isloggedin = false;
        isadmin = false;
        await handleLogout();
      }
      // Perform actions that depend on the updated DOM here
    } else {
      goto("/login");
    }
  });
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
<slot />

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
