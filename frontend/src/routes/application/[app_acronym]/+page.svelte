<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  export let data;

  let tasks = [
    { id: 1, status: "Open", name: "Task 1", description: "Description 1", plan: "Plan 1" },
    { id: 2, status: "To Do", name: "Task 2", description: "Description 2", plan: "Plan 2" },
    { id: 3, status: "Doing", name: "Task 3", description: "Description 3", plan: "Plan 3" },
    { id: 4, status: "Done", name: "Task 4", description: "Description 4", plan: "Plan 4" },
    { id: 5, status: "Closed", name: "Task 5", description: "Description 5", plan: "Plan 5" }
  ];

  const columns = ["Open", "To Do", "Doing", "Done", "Closed"];

  onMount(async () => {
    console.log("create task page mounted!");
    // console.log(data);
    console.log($page.url.pathname);
  });
</script>

<div>
  <h1>Tasks for {data.app_acronym}</h1>
  <div class="create-task">
    <button
      on:click={() => {
        goto($page.url.pathname + "/createtask");
      }}>+ Create Task</button
    >
  </div>
  <div class="board">
    {#each columns as column}
      <div class="column">
        <h2>{column}</h2>
        {#each tasks.filter(task => task.status === column) as task}
          <div class="task">
            <p>{task.name}</p>
            <p>{task.description}</p>
            <p>{task.plan}</p>
            {#if column === "Done"}
              <button>Review Task</button>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

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
    border: 1px solid #000;
    margin: 10px 0;
    padding: 10px;
  }
  .create-task {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
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
</style>
