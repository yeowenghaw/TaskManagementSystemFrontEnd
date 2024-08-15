<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { goto } from "$app/navigation";

  let usergroup;
  let usergroupdata;
  let applicationdata;

  const getData = async () => {
    const applicationresponse = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/allapps`,
      withCredentials: true
    });

    applicationdata = applicationresponse.data;

    const usergroupresponse = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/auth/group`,
      withCredentials: true
    });

    ///auth/group
    usergroupdata = usergroupresponse.data;
    usergroup = usergroupdata.data.map(item => item.groupname);
  };

  onMount(async () => {
    await getData();
    console.log(usergroup);
    console.log("user group includes project lead is: " + usergroup.includes("projectlead"));
  });
</script>

<h1>Main Page</h1>

{#if usergroupdata}
  <div class="applications">
    {#if usergroup.includes("projectlead")}
      <button
        class="create-button"
        on:click={() => {
          goto("/createapplication");
        }}>Create Application</button
      >
    {/if}
    <div class="container">
      {#each applicationdata.data as applications}
        <div class="box">
          <button class="box-button" on:click={() => goto("/application/" + applications.app_acronym)}>{applications.app_acronym}</button>
          {#if usergroup.includes("projectlead")}
            <button class="edit-button" on:click={() => goto("/edit/" + applications.app_acronym)}>Edit</button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else}
  ...loading
{/if}

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
