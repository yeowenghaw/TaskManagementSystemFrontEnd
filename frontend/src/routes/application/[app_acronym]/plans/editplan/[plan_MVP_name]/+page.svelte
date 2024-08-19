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
  let plan_startDate = ""; // Format: YYYY-MM-DD
  let plan_endDate = "";

  const handleUpdatePlan = async event => {
    try {
      //console.log("making axios post");
      console.log("plan_app_Acronym: " + applicationname);
      console.log("plan_MVP_name: " + planMvpName);
      console.log("plan_startDate: " + plan_startDate);
      console.log("plan_endDate: " + plan_endDate);
      const response = await axios({
        method: "put",
        url: "http://localhost:3000/api/v1/plan",
        data: {
          plan_app_Acronym: applicationname,
          plan_MVP_name: planMvpName,
          plan_startDate: plan_startDate,
          plan_endDate: plan_endDate
        },
        withCredentials: true
      });
      //console.log(response);
      //errormessage = response.message;
      if (response.status === 200) {
        errormessage = response.data.message;
        //window.location.reload();
      }
    } catch (error) {
      console.log(error);
      errormessage = error.response.data.message;
    }
  };

  const getData = async () => {
    applicationname = $page.params.app_acronym;
    currentpath = $page.url.pathname;
    planMvpName = $page.params.plan_MVP_name;

    try {
      const usergroupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/group`,
        withCredentials: true
      });

      const plansresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/plan`,
        headers: {
          "app-acronym": applicationname,
          "plan-mvp-name": planMvpName
        },
        withCredentials: true
      });

      usergroup = usergroupresponse.data.data.map(item => item.groupname);
      console.log(plansresponse.data.data[0]);
      plan_startDate = plansresponse.data.data[0].plan_startDate.split("T")[0];
      plan_endDate = plansresponse.data.data[0].plan_endDate.split("T")[0];
      console.log("plan_startDate: " + plan_startDate);
      console.log("plan_endDate: " + plan_endDate);
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
      const previouspreviouspath = previouspath.substring(0, previouspath.lastIndexOf("/"));
      goto(previouspreviouspath);
    }
    // console.log(usergroup);
    // console.log(applicationname);
    // console.log(currentpath);
  });
</script>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}
{#if usergroup && applicationname && currentpath}
  <div class="container">
    <div class="back-button">
      <button
        class="createapp-button"
        on:click={() => {
          const previouspath = currentpath.substring(0, currentpath.lastIndexOf("/"));
          const previouspreviouspath = previouspath.substring(0, previouspath.lastIndexOf("/"));
          goto(previouspreviouspath);
        }}>Back</button
      >
    </div>

    <h1>{planMvpName}</h1>

    <div class="form">
      <div class="form-group">
        <h2>Plan MVP Name</h2>
        {planMvpName}
      </div>
      <div class="form-group">
        <h2>Plan Start Date</h2>
        <input type="date" bind:value={plan_startDate} />
      </div>
      <div class="form-group">
        <h2>Plan End Date</h2>
        <input type="date" bind:value={plan_endDate} />
      </div>
      <div>
        <button
          class="save-button"
          on:click={() => {
            handleUpdatePlan();
          }}>Save Changes</button
        >
      </div>
    </div>
  </div>
{:else}
  <p>...loading</p>
{/if}

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
  }

  .back-button {
    margin-bottom: 20px;
  }

  .form {
    border: 1px solid #ddd;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
  }

  input[type="date"] {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 150px;
  }

  .save-button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save-button:hover {
    background-color: #218838;
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
