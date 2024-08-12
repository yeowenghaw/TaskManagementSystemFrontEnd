<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let authorization = {
    isuser: true,
    isadmin: true
  };

  const checkPermissions = async () => {
    await handleCheckUser();
    await handleCheckAdmin();
  };

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
        console.log("logged out successfully");
      } else {
        console.error("Logout failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error.response || error.message);
    }
    authorization.isuser = false;
    authorization.isadmin = false;
    goto("/login");
  };

  const handleCheckUser = async () => {
    console.log("checking user...");
    try {
      console.log("making axios post");
      const response = await axios({
        method: "get",
        url: "http://localhost:3000/api/v1/auth/user",
        withCredentials: true
      });
      authorization.isuser = true;
    } catch (error) {
      //console.log($page.url.pathname);
      if ($page.url.pathname !== "/login") {
        console.log("Failed to authorize user, logging out");
        console.log(error);
        await handleLogout();
      }
      authorization.isuser = false;
    }
  };

  const handleCheckAdmin = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:3000/api/v1/auth/admin",
        withCredentials: true
      });
      authorization.isadmin = true;
    } catch (error) {
      authorization.isadmin = false;
    }
  };

  onMount(async () => {
    // Your code here, this will run once the component is mounted
    console.log("lay out on mount is called!");
    checkPermissions();
  });
</script>

<div class="navbar">
  {#if authorization.isuser === true}
    <a href="/" data-sveltekit-reload>Home</a>
  {:else}
    <a href="/login" data-sveltekit-reload>Home</a>
  {/if}

  {#if authorization.isuser === true}
    <a href="/profile" data-sveltekit-reload>Profile</a>
    {#if authorization.isadmin === true}
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
