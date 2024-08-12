<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import axios from "axios";
  export let data;
  let authorization = {
    isprojectlead: false
  };

  let errormessage = "";

  let app_description = "";
  let app_startdate = "";
  let app_enddate = "";
  let app_permit_create = "";
  let app_permit_open = "";
  let app_permit_todolist = "";
  let app_permit_doing = "";
  let app_permit_done = "";

  const checkPermissions = async () => {
    await handleCheckProjectLead();
    if (data.appdata) {
      initialiseValues();
    } else {
      goto("/");
    }
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
      goto("/");
    }
  };

  function formatDate(dateString) {
    // Parse the date string to a Date object
    const date = new Date(dateString);

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    // Format the extracted values into yyyy-MM-dd format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  const initialiseValues = async () => {
    app_description = data.appdata.data[0].app_description;
    app_startdate = formatDate(data.appdata.data[0].app_startdate);
    app_enddate = formatDate(data.appdata.data[0].app_enddate);
    app_permit_create = data.appdata.data[0].app_permit_create;
    app_permit_open = data.appdata.data[0].app_permit_open;
    app_permit_todolist = data.appdata.data[0].app_permit_todolist;
    app_permit_doing = data.appdata.data[0].app_permit_doing;
    app_permit_done = data.appdata.data[0].app_permit_done;
  };

  onMount(async () => {
    console.log("create application page mounted!");
    checkPermissions();
    // console.log(data.groupdata.data);
    // console.log(data.appdata.data[0]);
  });

  const handleUpdateApp = async event => {
    // Handle form submission logic
    console.log({
      app_description,
      app_startdate,
      app_enddate,
      app_permit_create,
      app_permit_open,
      app_permit_todolist,
      app_permit_doing,
      app_permit_done
    });

    try {
      //console.log("making axios post");
      const response = await axios({
        method: "put",
        url: "http://localhost:3000/api/v1/app",
        data: {
          app_acronym: data.appdata.data[0].app_acronym,
          app_description: app_description,
          app_startdate: app_startdate,
          app_enddate: app_enddate,
          app_permit_create: app_permit_create,
          app_permit_open: app_permit_open,
          app_permit_todolist: app_permit_todolist,
          app_permit_doing: app_permit_doing,
          app_permit_done: app_permit_done
        },
        withCredentials: true
      });
      //console.log(response);
      //errormessage = response.message;
      if (response.status === 200) {
        errormessage = response.data.message;
        window.location.reload();
      }
    } catch (error) {
      //console.log(error);
      errormessage = error.response.data.message;
    }
  };
</script>

<br />
<div>
  <button class="createapp-button" on:click={() => goto("/")}>Back</button>
</div>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}

{#if data.appdata && data.groupdata.data}
  <div class="applications">
    <h1>Editing {data.appdata.data[0].app_acronym}</h1>
    <form on:submit|preventDefault={handleUpdateApp}>
      <div class="form-container">
        <div class="left-column">
          <div class="form-group">
            <p>app_acronym:</p>
            <p>{data.appdata.data[0].app_acronym}</p>
          </div>
          <div class="form-group">
            <p>app_description:</p>
            <textarea class="createapp-textarea" bind:value={app_description} placeholder="Text Area"></textarea>
          </div>
          <div class="form-group">
            <p>app_rnumber:</p>
            <p>{data.appdata.data[0].app_rnumber}</p>
          </div>
          <div class="form-group">
            <p>Start Date:</p>
            <input class="createapp-input" type="date" bind:value={app_startdate} />
          </div>
          <div class="form-group">
            <p>End Date:</p>
            <input class="createapp-input" type="date" bind:value={app_enddate} />
          </div>
        </div>
        <div class="right-column">
          <div class="form-group">
            <p>Permit_Create:</p>
            <select class="createapp-select" bind:value={app_permit_create}>
              <option></option>
              {#each data.groupdata.data.map(item => item.groupname) as group}
                <option>{group}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <p>Permit_Open:</p>
            <select class="createapp-select" bind:value={app_permit_open}>
              <option></option>
              {#each data.groupdata.data.map(item => item.groupname) as group}
                <option>{group}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <p>Permit_ToDo:</p>
            <select class="createapp-select" bind:value={app_permit_todolist}>
              <option></option>
              {#each data.groupdata.data.map(item => item.groupname) as group}
                <option>{group}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <p>Permit_Doing:</p>
            <select class="createapp-select" bind:value={app_permit_doing}>
              <option></option>
              {#each data.groupdata.data.map(item => item.groupname) as group}
                <option>{group}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <p>Permit_Done:</p>
            <select class="createapp-select" bind:value={app_permit_done}>
              <option></option>
              {#each data.groupdata.data.map(item => item.groupname) as group}
                <option>{group}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button class="createapp-button" type="submit">Submit</button>
      </div>
    </form>
  </div>
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
  .form-container {
    display: flex;
    justify-content: space-between;
    background-color: #fff; /* Add background color */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow for better look */
    padding: 80px; /* Add padding inside the form container */
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 20px; /* Space between the form and the bottom of the page */
  }
  .left-column,
  .right-column {
    width: 50%;
  }
  .form-group {
    margin: 50px;
  }
  .createapp-input,
  .createapp-textarea,
  .createapp-select {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd; /* Add border for inputs, textareas, and selects */
    border-radius: 5px; /* Add border radius */
  }
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 50px;
  }
  .createapp-button {
    padding: 10px 20px;

    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px; /* Adjust font size */
    border-radius: 5px; /* Add border radius */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow for button */
  }
</style>
