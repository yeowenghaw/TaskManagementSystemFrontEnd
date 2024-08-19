<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import axios from "axios";

  let usergroup;
  let applicationname;
  let currentpath;
  let errormessage = "";

  let planMvpName = "";
  let startDate = "";
  let endDate = "";

  // function handleSubmit() {
  //   // Handle form submission, for example, send data to an API or database
  //   console.log({ planMvpName, startDate, endDate });
  // }

  //plan_MVP_name, plan_startDate, plan_endDate, plan_app_Acronym
  const handleCreateNewPlan = async event => {
    console.log("create new plan called");
    try {
      //console.log("making axios post");
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/plan",
        data: {
          plan_MVP_name: planMvpName,
          plan_startDate: startDate,
          plan_endDate: endDate,
          plan_app_Acronym: applicationname
        },
        withCredentials: true
      });
      //console.log(response);
      //errormessage = response.message;
      if (response.status === 200) {
        errormessage = response.data.message;
        // reset fields
        planMvpName = "";
        startDate = "";
        endDate = "";
        const previouspath = currentpath.substring(0, currentpath.lastIndexOf("/"));
        goto(previouspath);
      }
    } catch (error) {
      console.log(error);
      errormessage = error.response.data.message;
    }
  };

  const getData = async () => {
    applicationname = $page.params.app_acronym;
    currentpath = $page.url.pathname;
    try {
      const usergroupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/group`,
        withCredentials: true
      });

      usergroup = usergroupresponse.data.data.map(item => item.groupname);
    } catch (error) {
      console.log("error fetching user data", error);
      return {};
    }
  };

  onMount(async () => {
    console.log("plan page mounted!");
    await getData();
    if (!usergroup.includes("projectmanager")) {
      const previouspath = currentpath.substring(0, currentpath.lastIndexOf("/"));
      goto(previouspath);
    }
    console.log(usergroup);
    console.log(applicationname);
    console.log(currentpath);
  });
</script>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}
<div class="container">
  <div class="back-button">
    <button
      class="createapp-button"
      on:click={() => {
        const previouspath = currentpath.substring(0, currentpath.lastIndexOf("/"));
        goto(previouspath);
      }}>Back</button
    >
  </div>

  <h1>Create Plan</h1>

  <div class="form-group">
    <label for="planMvpName">Plan MVP Name:</label>
    <input type="text" id="planMvpName" bind:value={planMvpName} />
  </div>

  <div class="form-group">
    <label for="startDate">Start Date:</label>
    <input type="date" id="startDate" bind:value={startDate} />
  </div>

  <div class="form-group">
    <label for="endDate">End Date:</label>
    <input type="date" id="endDate" bind:value={endDate} />
  </div>

  <div class="form-actions">
    <button
      on:click={() => {
        handleCreateNewPlan();
      }}>Submit</button
    >
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .back-button {
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: inline-block;
    width: 150px;
    text-align: right;
    margin-right: 10px;
  }

  input[type="text"],
  input[type="date"] {
    width: 250px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-actions {
    text-align: center;
    margin-top: 20px;
  }

  .form-actions button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .form-actions button:hover {
    background-color: #0056b3;
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
