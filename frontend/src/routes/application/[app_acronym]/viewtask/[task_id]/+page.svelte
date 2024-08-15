<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import axios from "axios";

  // will be an array
  let usergroup;
  let applicationname;
  let taskname;
  let currentpath;
  let plans;

  let appdata;
  let taskdata;
  // will be an array
  let tasknotedata;

  let newdescription = "";
  let newnote = "";
  let newplan;

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

  const handleUpdateTask = async newstate => {
    console.log("create update task called");

    console.log("new description: " + newdescription);
    console.log("new note: " + newnote);
    console.log("new state: " + newstate);

    try {
      //console.log("making axios post");
      const response = await axios({
        method: "put",
        url: "http://localhost:3000/api/v1/task",
        data: {
          task_id: taskdata.task_id,
          task_description: newdescription,
          task_plan: newplan,
          task_notes: newnote,
          task_state: newstate
        },
        withCredentials: true
      });
      //console.log(response);
      //errormessage = response.message;
      if (response.status === 200) {
        errormessage = response.data.message;
        // reset fields
        newnote = "";
        window.location.reload();
      }
    } catch (error) {
      errormessage = error.response.data.message;
      console.log(error);
    }
  };

  const getData = async () => {
    applicationname = $page.params.app_acronym;
    taskname = $page.params.task_id;
    currentpath = $page.url.pathname;
    try {
      const usergroupresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/auth/group`,
        withCredentials: true
      });

      const taskresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/task`,
        headers: {
          task_id: taskname
        },
        withCredentials: true
      });

      const appresponse = await axios({
        method: "get",
        url: "http://localhost:3000/api/v1/app",
        headers: {
          "app-acronym": applicationname
        },
        withCredentials: true
      });

      const allplansresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/allplans`,
        headers: {
          "app-acronym": applicationname
        },
        withCredentials: true
      });

      appdata = appresponse.data.data[0];
      taskdata = taskresponse.data.data.result[0];
      tasknotedata = taskresponse.data.data.tasknoteresult;
      plans = allplansresponse.data.data.map(item => item.plan_MVP_name);
      usergroup = usergroupresponse.data.data.map(item => item.groupname);
      newdescription = taskdata.task_description;
      newplan = taskdata.task_plan;
    } catch (error) {
      console.log("error fetching data");
      console.log(error);
      return {};
    }
  };

  onMount(async () => {
    await getData();
  });

  let errormessage = "";
</script>

{#if errormessage.length > 0}
  <h1>{errormessage}</h1>
{/if}
{#if taskdata && appdata && tasknotedata && plans}
  <div class="task-details-container">
    <button class="createapp-button"
      on:click={() => {
        const previouspath = currentpath.substring(0, currentpath.lastIndexOf("/"));
        const previouspreviouspath = previouspath.substring(0, previouspath.lastIndexOf("/"));
        goto(previouspreviouspath);
      }}>Back</button
    >
    <h1>{taskdata.task_name}</h1>
    <div class="task-details">
      <div class="task-info">
        <p><strong>Description:</strong></p>
        <div class="add-note">
          {#if (taskdata.task_state === "open" && usergroup.includes(appdata.app_permit_open)) || (taskdata.task_state === "done" && usergroup.includes(appdata.app_permit_done))}
            <textarea id="new-note" placeholder="Update Details..." bind:value={newdescription}></textarea>
          {:else}
            <p>{taskdata.task_description}</p>
          {/if}
        </div>
        <p><strong>Task ID:</strong> {taskdata.task_id}</p>
        <p><strong>State:</strong> {taskdata.task_state}</p>
        <p><strong>Creator:</strong> {taskdata.task_creator}</p>
        <p><strong>Owner:</strong> {taskdata.task_owner}</p>
        <p><strong>Create Date:</strong> {formatDate(taskdata.task_createDate)}</p>
        {#if (taskdata.task_state === "open" && usergroup.includes(appdata.app_permit_open)) || (taskdata.task_state === "done" && usergroup.includes(appdata.app_permit_done))}
          <strong>Plan:</strong>
          <select id="plan" class="create-task-select" bind:value={newplan}>
            <option value=""></option>
            {#each plans as plan}
              <option value={plan}>{plan}</option>
            {/each}
          </select>
        {:else}
          <p>
            <strong>Plan:</strong>
            {#if taskdata.task_plan}
              {taskdata.task_plan}
            {:else}
              None
            {/if}
          </p>
        {/if}
      </div>
      <div class="task-notes">
        <p><strong>Notes</strong></p>
        <div class="notes-content">
          {#each tasknotedata as tasknotes}
            <p>{@html tasknotes.notes.replace(/\n/g, "<br>")}</p>
          {/each}
        </div>
        {#if (taskdata.task_state === "open" && usergroup.includes(appdata.app_permit_open)) || (taskdata.task_state === "todo" && usergroup.includes(appdata.app_permit_todolist)) || (taskdata.task_state === "doing" && usergroup.includes(appdata.app_permit_doing)) || (taskdata.task_state === "done" && usergroup.includes(appdata.app_permit_done))}
          <div class="add-note">
            <label for="new-note"><strong>Enter New Note:</strong></label>
            <textarea id="new-note" placeholder="Update Details..." bind:value={newnote}></textarea>
          </div>
        {/if}
      </div>
    </div>
    <br />
    <br />
    <div class="task-actions">
      {#if taskdata.task_state === "open" && usergroup.includes(appdata.app_permit_open)}
        <button class="take-task" on:click={() => handleUpdateTask("todo")}>Release Task</button>
        <button class="take-task" on:click={() => handleUpdateTask()}>Update</button>
      {:else if taskdata.task_state === "todo" && usergroup.includes(appdata.app_permit_todolist)}
        <button class="take-task" on:click={() => handleUpdateTask("doing")}>Take on Task</button>
        <button class="take-task" on:click={() => handleUpdateTask()}>Update</button>
      {:else if taskdata.task_state === "doing" && usergroup.includes(appdata.app_permit_doing)}
        <button class="take-task" on:click={() => handleUpdateTask("done")}>Submit Task</button>
        <button class="cancel" on:click={() => handleUpdateTask("todo")}>Give Up Task</button>
        <button class="take-task" on:click={() => handleUpdateTask()}>Update</button>
      {:else if taskdata.task_state === "done" && usergroup.includes(appdata.app_permit_done)}
        <button class="take-task" on:click={() => handleUpdateTask("closed")}>Accept Task</button>
        <button class="cancel" on:click={() => handleUpdateTask("doing")}>Reject Task</button>
        <button class="take-task" on:click={() => handleUpdateTask()}>Update</button>
      {/if}
      <!-- <button class="take-task">Take On Task</button> && usergroup.includes(appdata.app_permit_create)}
      <button class="update-details">Update Details</button>
      {#if taskdata.task_state === "open"}
        <button class="cancel">Cancel</button>
      {/if} -->
    </div>
  </div>
{:else}
  ...loading
{/if}

<style>
  .task-details-container {
    border: 1px solid #ccc;
    padding: 100px;
    margin: auto;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
  }

  .task-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .task-info,
  .task-notes {
    width: 45%;
  }

  .task-info p,
  .task-notes p {
    margin: 5px 0;
  }

  .task-notes .notes-content {
    height: 100px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 5px;
    margin-bottom: 10px;
  }

  .add-note textarea {
    width: 100%;
    height: 60px;
    padding: 5px;
    border: 1px solid #ccc;
  }

  .task-actions {
    display: flex;
    justify-content: space-between;
  }

  .task-actions button {
    width: 30%;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    border: none;
  }

  .take-task {
    background-color: #28a745;
    color: white;
  }

  .cancel {
    background-color: #dc3545;
    color: white;
  }

  .take-task:hover {
    background-color: #218838;
  }

  .cancel:hover {
    background-color: #c82333;
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
