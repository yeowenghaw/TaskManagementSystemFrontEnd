<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { goto } from "$app/navigation";
  export let data;

  let authorization = {
    isprojectlead: true
  };

  const checkPermissions = async () => {
    await handleCheckProjectLead();
  };

  const handleCheckProjectLead = async () => {
    //console.log("checking user...");
    try {
      //console.log("making axios post");
      const response = await axios({
        method: "get",
        url: "http://localhost:3000/api/v1/auth/projectlead",
        withCredentials: true
      });
      authorization.isprojectlead = true;
    } catch (error) {
      console.log(error);
      authorization.isprojectlead = false;
    }
  };

  const editApplication = async applicationname => {
    goto("/editapplication/" + applicationname);
  };

  $: {
    // authorization.isuser;
    // authorization.isadmin;
    // authorization.isprojectlead;
    // authorization.isprojectmanager;
    // //authorization;
    // //console.log(authorization);
    // //setContext("authorization", authorization);
  }

  onMount(async () => {
    console.log("main page mounted!");
    //checkPermissions();
    //console.log(data.applicationdata.data);
  });
</script>

<h1>Main Page</h1>
<p>The user is project lead: {authorization.isprojectlead}</p>
<div class="applications">
  <button
    class="create-button"
    on:click={() => {
      goto("/createapplication");
    }}>Create Application</button
  >
  <div class="container">
    {#each data.applicationdata.data as applications}
      <div class="box">
        <button class="box-button" on:click={() => goto("/application/" + applications.app_acronym)}>{applications.app_acronym}</button>
        <button class="edit-button" on:click={() => goto("/editapplication/" + applications.app_acronym)}>Edit</button>
      </div>
    {/each}
  </div>
</div>

<style>
  .applications {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center horizontally */
    padding: 20px; /* Space around the content */
    height: 100vh;
    box-sizing: border-box;
    text-align: center; /* Center text inside the container */
  }

  .create-button {
    align-self: flex-end; /* Aligns the button to the right */
    border: none;
    background-color: blue;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px; /* Space between the button and container */
  }

  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columns of equal width */
    gap: 10px; /* Space between boxes */
    width: 100%; /* Full width of the parent element */
    max-width: 1200px; /* Optional: to limit the width */
    height: auto; /* Adjust height based on content */
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: add some shadow for better look */
    padding: 20px; /* Padding inside the container */
    box-sizing: border-box;
  }

  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 1px solid #ddd;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: add some shadow for better look */
  }

  .box-button {
    border: none;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }

  .edit-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border: none;
    background-color: #6c757d;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
  }
</style>
