<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import axios from "axios";

  let usergroup;
  let applicationname;
  let allplansdata;
  let currentpath;

  const getData = async () => {
    applicationname = $page.params.app_acronym;
    currentpath = $page.url.pathname;
    try {
      const allplansresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/allplans`,
        headers: {
          "app-acronym": applicationname
        },
        withCredentials: true
      });

      const usergroupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/group`,
        withCredentials: true
      });

      usergroup = usergroupresponse.data.data.map(item => item.groupname);
      allplansdata = allplansresponse.data.data;
    } catch (error) {
      console.log("error fetching user data", error);
      return {};
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

  onMount(async () => {
    console.log("plan page mounted!");
    await getData();
    console.log(usergroup);
    console.log(applicationname);
    console.log(allplansdata);
    console.log(currentpath);
  });
</script>

<div class="container">
  <div class="back-button">
    <button  class="createapp-button"
      on:click={() => {
        const previouspath = currentpath.substring(0, currentpath.lastIndexOf("/"));
        goto(previouspath);
      }}>Back</button
    >
  </div>
  {#if allplansdata && usergroup && applicationname && currentpath}
    <h1>{applicationname}'s Plans</h1>

    <div class="create-plan">
      <button
        on:click={() => {
          goto(currentpath + "/createplan");
        }}>+ Create Plan</button
      >
    </div>

    {#each allplansdata as plan}
      <div class="plan">
        <div class="plan-info">
          <p><strong>Plan MVP Name:</strong> {plan.plan_MVP_name}</p>
          <p><strong>Plan Start Date:</strong> {formatDate(plan.plan_startDate)}</p>
          <p><strong>Plan End Date:</strong> {formatDate(plan.plan_endDate)}</p>
        </div>
        <div
          class="button-group"
          on:click={() => {
            goto(currentpath + "/editplan/" + plan.plan_MVP_name);
          }}
        >
          <button>+ Edit</button>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .container {
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

  .plan {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .plan-info {
    flex: 1;
  }

  .plan-info p {
    margin: 0;
  }

  .button-group {
    display: flex;
    flex-direction: column;
  }

  .button-group button {
    margin-bottom: 5px;
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  .button-group button:hover {
    background-color: #0056b3;
  }

  .create-plan {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }

  .create-plan button {
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  .create-plan button:hover {
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
