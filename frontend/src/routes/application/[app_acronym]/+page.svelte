<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import axios from "axios";

  const columns = ["open", "todo", "doing", "done", "closed"];
  let alltaskdata;
  let usergroup;
  let applicationname;
  let appdata;

  const getData = async () => {
    applicationname = $page.params.app_acronym;
    try {
      const alltaskresponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/v1/alltasks`,
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

      const appresponse = await axios({
        method: "get",
        url: "http://localhost:3000/api/v1/app",
        headers: {
          "app-acronym": applicationname
        },
        withCredentials: true
      });

      appdata = appresponse.data.data[0];
      usergroup = usergroupresponse.data.data.map(item => item.groupname);
      alltaskdata = alltaskresponse.data.data;
    } catch (error) {
      console.log("error fetching user data", error);
      return {};
    }
  };

  onMount(async () => {
    console.log("create task page mounted!");
    await getData();
    console.log(usergroup);
    console.log(alltaskdata);
  });
</script>

{#if alltaskdata && applicationname && usergroup && appdata}
  <div>
    <h1>Tasks for {applicationname}</h1>
    <button
      on:click={() => {
        goto("/");
      }}>Back</button
    >

    {#if usergroup.includes("projectmanager")}
      <div class="create-task">
        <button
          on:click={() => {
            goto($page.url.pathname + "/plans");
          }}>Plans</button
        >
      </div>
    {/if}
    {#if usergroup.includes(appdata.app_permit_create)}
      <div class="create-task">
        <button
          on:click={() => {
            goto($page.url.pathname + "/createtask");
          }}>+ Create Task</button
        >
      </div>
    {/if}
    <div class="board">
      {#each columns as column}
        <div class="column">
          <h2>{column}</h2>
          {#each alltaskdata.filter(task => task.task_state === column) as task}
            <div class="task">
              <button on:click={() => goto($page.url.pathname + "/viewtask/" + task.task_id)}>
                <div class="notes-content">
                  <p>Name: {task.task_name}</p>
                </div>
                <div class="notes-content">
                  <p>Description:</p>
                  <p>{task.task_description}</p>
                </div>
                {#if task.task_plan}
                  <div class="notes-content">
                    <p>Plan: {task.task_plan}</p>
                  </div>
                {:else}
                  <p>Plan: None</p>
                {/if}

                {#if column === "Done"}
                  <button>Review Task</button>
                {/if}
              </button>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .board {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  .column {
    border: 1px solid #ccc;
    width: 18%;
    padding: 10px;
    box-sizing: border-box;
  }
  .task {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    width: 100%; /* Ensure task takes full width of the container */
  }
  .create-task {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .task button {
    width: 100%; /* Make the button fill the entire width */
    text-align: left; /* If you want text inside the button aligned to the left */
    display: flex;
    flex-direction: column; /* Aligns text vertically in the button */
    align-items: flex-start; /* Aligns the content to the left */
    padding: 10px; /* Ensure there's padding inside the button */
  }
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }

  .notes-content {
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 5px;
    flex-grow: 1; /* Allows .notes-content to expand and fill available space */
    margin-bottom: 10px;
    height: 100px; /* Set the width to 100% to match the task width */
    width: 100%; /* Set the width to 100% to match the task width */
    box-sizing: border-box; /* Include padding and border in the element's width and height */
  }
</style>
