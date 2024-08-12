<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import axios from "axios";
  export let data;

  onMount(async () => {
    // console.log("create task page mounted!");
    app_acronym = data.app_acronym;
    console.log(data.app_acronym);
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

  const plans = ["Plan 1", "Plan 2", "Plan 3"];

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
      }
    } catch (error) {
      console.log(error);
      errormessage = error.response.data.message;
    }
  };
</script>

<h1>Create Task Page</h1>
<button
  on:click={() => {
    const previouspath = $page.url.pathname.substring(0, $page.url.pathname.lastIndexOf("/"));
    goto(previouspath);
  }}>Back</button
>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}
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
        <option value="" disabled>Select Plan</option>
        {#each plans as plan}
          <option value={plan}>{plan}</option>
        {/each}
      </select>
    </div>
    <button type="submit" class="create-task-button">Submit</button>
  </form>
</div>

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
</style>
