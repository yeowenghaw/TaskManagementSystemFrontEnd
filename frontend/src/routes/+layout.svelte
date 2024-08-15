<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let usergroup;
  let usergroupdata;
  let isloggedin;

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
    window.location.reload();
    goto("/login");
  };

  const getData = async () => {
    console.log("checking valid user...");
    try {
      const userresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/user`,
        data: {
          app_acronym: "random application",
          randomdata: "random data"
        },
        withCredentials: true
      });

      console.log("checking user belong to what group...");
      const usergroupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/group`,
        withCredentials: true
      });

      ///auth/group

      usergroupdata = usergroupresponse.data;
      usergroup = usergroupdata.data.map(item => item.groupname);

      if (userresponse.status === 200) {
        isloggedin = true;
      }
    } catch (error) {
      if (error.status !== 200) {
        isloggedin = false;
      }
    }
    // isloggedin = userresponse.response.status;
    // console.log(userresponse);
  };

  onMount(async () => {
    // Your code here, this will run once the component is mounted
    console.log("lay out on mount is called!");
    //checkPermissions();
    await getData();
    // console.log("isloggedin is: " + isloggedin);
    // console.log("$page.url.pathname is: " + $page.url.pathname);
    if (isloggedin === false && $page.url.pathname !== "/login") {
      goto("/login");
    }
  });
</script>

{#if usergroupdata}
  <div class="navbar">
    {#if true}
      <a href="/" data-sveltekit-reload>Home</a>
    {:else}
      <a href="/login" data-sveltekit-reload>Home</a>
    {/if}

    {#if true}
      <a href="/profile" data-sveltekit-reload>Profile</a>
      {#if usergroup.includes("admin")}
        <a href="/usermanagement" data-sveltekit-reload>UserManagement</a>
      {/if}
      <div class="right">
        <button on:click={handleLogout} class="nav-button" navigating>Log Out</button>
      </div>
    {/if}
  </div>
{/if}

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
