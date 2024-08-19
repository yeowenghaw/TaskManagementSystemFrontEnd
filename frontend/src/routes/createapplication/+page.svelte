<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import axios from "axios";

  let errormessage = "";
  let groupdata;
  let usergroup;
  let usergroupdata;

  let app_acronym = "";
  let app_description = "";
  let app_rnumber = "";
  let app_startdate = "";
  let app_enddate = "";
  let app_permit_create = "";
  let app_permit_open = "";
  let app_permit_todolist = "";
  let app_permit_doing = "";
  let app_permit_done = "";

  const handleCreateNewApp = async event => {
    // Handle form submission logic
    console.log({
      app_acronym,
      app_description,
      app_rnumber,
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
        method: "post",
        url: "http://localhost:3000/api/v1/app",
        data: {
          app_acronym: app_acronym,
          app_description: app_description,
          app_rnumber: app_rnumber,
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
        // reset fields
        app_acronym = "";
        app_description = "";
        app_rnumber = "";
        app_startdate = "";
        app_enddate = "";
        app_permit_create = "";
        app_permit_open = "";
        app_permit_todolist = "";
        app_permit_doing = "";
        app_permit_done = "";
        goto("/");
      }
    } catch (error) {
      //console.log(error);
      errormessage = error.response.data.message;
    }
  };

  const getData = async () => {
    try {
      const groupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/groups`,
        withCredentials: true
      });

      const usergroupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/group`,
        withCredentials: true
      });

      ///auth/group
      usergroupdata = usergroupresponse.data;
      usergroup = usergroupdata.data.map(item => item.groupname);

      groupdata = groupresponse.data.data.map(item => item.groupname);
    } catch (error) {
      console.log("error fetching user data", error);
      return {};
    }
  };

  onMount(async () => {
    console.log("create application page mounted!");
    await getData();
    console.log(groupdata);
    if (!usergroup.includes("projectlead")) {
      goto("/");
    }
  });
</script>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}
{#if groupdata && usergroup}
  <div class="applications">
    <form on:submit|preventDefault={handleCreateNewApp}>
      <div class="form-container">
        <div class="header">
          <button class="createapp-button" on:click={() => goto("/")}>Back</button>
          <h3>Create Application</h3>
        </div>
        <div class="three-columns">
          <div class="left-column">
            <div class="form-group">
              <p>app_acronym:</p>
              <input class="createapp-input" type="text" bind:value={app_acronym} placeholder="application name" />
            </div>
            <div class="form-group">
              <p>app_rnumber:</p>
              <input class="createapp-input" type="number" bind:value={app_rnumber} placeholder="Number Field" />
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
          <div class="middle-column">
            <div class="form-group">
              <p>Permit_Create:</p>
              <select class="createapp-select" bind:value={app_permit_create}>
                <option></option>
                {#each groupdata as group}
                  <option>{group}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <p>Permit_Open:</p>
              <select class="createapp-select" bind:value={app_permit_open}>
                <option></option>
                {#each groupdata as group}
                  <option>{group}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <p>Permit_ToDo:</p>
              <select class="createapp-select" bind:value={app_permit_todolist}>
                <option></option>
                {#each groupdata as group}
                  <option>{group}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <p>Permit_Doing:</p>
              <select class="createapp-select" bind:value={app_permit_doing}>
                <option></option>
                {#each groupdata as group}
                  <option>{group}</option>
                {/each}
              </select>
            </div>
            <div class="form-group">
              <p>Permit_Done:</p>
              <select class="createapp-select" bind:value={app_permit_done}>
                <option></option>
                {#each groupdata as group}
                  <option>{group}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="right-column">
            <div class="form-group full-height">
              <p>app_description:</p>
              <textarea class="createapp-textarea large-textarea" bind:value={app_description} placeholder="description here"></textarea>
            </div>
          </div>
        </div>
        <div class="button-container">
          <button class="createapp-button" type="submit">Submit</button>
        </div>
      </div>
    </form>
  </div>
{:else}
  <p>...loading</p>
{/if}

<style>
  .applications {
    margin: 0 auto; /* Center horizontally */
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
  .form-container {
    margin: 0 auto; /* Center horizontally */
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    overflow-y: auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .three-columns {
    display: flex;
    justify-content: space-between;
    gap: 20px; /* Adds spacing between the columns */
  }
  .left-column,
  .middle-column,
  .right-column {
    width: 32%; /* Each column takes up roughly a third of the container */
    display: flex;
    flex-direction: column;
  }
  .form-group {
    margin-bottom: 10px;
  }
  .full-height {
    height: 100%;
  }
  .createapp-input,
  .createapp-textarea,
  .createapp-select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .large-textarea {
    height: calc(90%);
  }
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .createapp-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  textarea {
    resize: none;
  }
</style>
