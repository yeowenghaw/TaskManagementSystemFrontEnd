<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import axios from "axios";

  onMount(async () => {
    // console.log("create task page mounted!");
    app_acronym = $page.params.app_acronym;
    console.log(app_acronym);
    // console.log(data.appdata);
    // console.log(data.userdata);
    //console.log(data.appdata.data[0].app_acronym);
    //console.log(data.userdata.username);
  });

  let errormessage = "";

  let task_name = "";
  let task_description = "";
  let task_plan = "";
  let app_acronym = "";

  let usergroup;
  let appdata;
  let plans;
  let previouspath;

  const getData = async () => {
    app_acronym = $page.params.app_acronym;
    try {
      const allplansresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/allplans`,
        headers: {
          "app-acronym": app_acronym
        },
        withCredentials: true
      });

      const usergroupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/group`,
        withCredentials: true
      });

      const appresponse = await axios({
        method: "get",
        url: "http://localhost:3000/api/v1/app",
        headers: {
          "app-acronym": app_acronym
        },
        withCredentials: true
      });

      usergroup = usergroupresponse.data.data.map(item => item.groupname);
      plans = allplansresponse.data.data.map(item => item.plan_MVP_name);
      appdata = appresponse.data.data[0];
      previouspath = $page.url.pathname.substring(0, $page.url.pathname.lastIndexOf("/"));
    } catch (error) {
      console.log("error fetching user data", error);
      return {};
    }
  };

  const handleCreateNewTask = async event => {
    console.log("create new task called");
    try {
      //console.log("making axios post");
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/task",
        data: {
          task_name: task_name,
          task_description: task_description,
          task_plan: task_plan,
          app_acronym: app_acronym
        },
        withCredentials: true
      });
      //console.log(response);
      //errormessage = response.message;
      if (response.status === 200) {
        errormessage = response.data.message;
        // reset fields
        task_name = "";
        task_description = "";
        task_plan = "";
        const previouspath = $page.url.pathname.substring(0, $page.url.pathname.lastIndexOf("/"));
        goto(previouspath);
      }
    } catch (error) {
      console.log(error);
      errormessage = error.response.data.message;
    }
  };

  onMount(async () => {
    console.log("create task page mounted!");
    await getData();
    // no permission to view this page
    if (!usergroup.includes(appdata.app_permit_create)) {
      goto(previouspath);
    }
    console.log(usergroup);
  });
</script>

<h1>Create Task Page</h1>
<button
  class="createapp-button"
  on:click={() => {
    goto(previouspath);
  }}>Back</button
>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}
{#if plans && appdata}
  <div class="form-container">
    <h1>Create Task for {app_acronym}</h1>
    <form on:submit={handleCreateNewTask}>
      <div class="form-group">
        <label for="name" class="create-task-label">Name:</label>
        <input type="text" class="create-task-input" id="name" bind:value={task_name} placeholder="Create Button" />
      </div>
      <div class="form-group">
        <label for="description" class="create-task-label">Description:</label>
        <textarea id="description" class="create-task-textarea" bind:value={task_description} placeholder="Text Area"></textarea>
      </div>
      <div class="form-group">
        <label for="plan" class="create-task-label">Plan:</label>
        <select id="plan" class="create-task-select" bind:value={task_plan}>
          <option value=""></option>
          {#each plans as plan}
            <option value={plan}>{plan}</option>
          {/each}
        </select>
      </div>
      <button type="submit" class="create-task-button">Submit</button>
    </form>
  </div>
{/if}

<style>
  .form-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .create-task-label {
    display: block;
    margin-bottom: 0.5rem;
  }

  .create-task-input,
  .create-task-textarea,
  .create-task-select,
  .create-task-button {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    box-sizing: border-box;
  }

  textarea {
    resize: none;
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
