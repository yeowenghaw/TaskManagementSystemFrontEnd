<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import axios from "axios";
  let authorization = {
    isprojectlead: false
  };

  const checkPermissions = async () => {
    await handleCheckProjectLead();
  };

  const handleCheckProjectLead = async () => {
    //console.log("checking user...");
    try {
      //console.log("making axios post");
      const response = await axios({
        method: "post",
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

  onMount(async () => {
    console.log("create application page mounted!");
    checkPermissions();
  });
  let acronym = "";
  let description = "";
  let rnumber = "";
  let startDate = "";
  let endDate = "";
  let permitCreate = "";
  let permitOpen = "";
  let permitToDo = "";
  let permitDoing = "";
  let permitDone = "";

  function handleSubmit() {
    // Handle form submission logic
    console.log({
      acronym,
      description,
      rnumber,
      startDate,
      endDate,
      permitCreate,
      permitOpen,
      permitToDo,
      permitDoing,
      permitDone
    });
  }
</script>

<br />
<div>
  <button class="createapp-button" on:click={() => history.back()}>Back</button>
</div>
<div class="applications">
  <h1>Create Application</h1>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-container">
      <div class="left-column">
        <div class="form-group">
          <p>Acronym:</p>
          <input class="createapp-input" type="text" bind:value={acronym} placeholder="Application 4" />
        </div>
        <div class="form-group">
          <p>Description:</p>
          <textarea class="createapp-textarea" bind:value={description} placeholder="Text Area"></textarea>
        </div>
        <div class="form-group">
          <p>Rnumber:</p>
          <input class="createapp-input" type="number" bind:value={rnumber} placeholder="Number Field" />
        </div>
        <div class="form-group">
          <p>Start Date:</p>
          <input class="createapp-input" type="date" bind:value={startDate} />
        </div>
        <div class="form-group">
          <p>End Date:</p>
          <input class="createapp-input" type="date" bind:value={endDate} />
        </div>
      </div>
      <div class="right-column">
        <div class="form-group">
          <p>Permit_Create:</p>
          <select class="createapp-select" bind:value={permitCreate}>
            <option>Select Group</option>
            <!-- Add other options here -->
          </select>
        </div>
        <div class="form-group">
          <p>Permit_Open:</p>
          <select class="createapp-select" bind:value={permitOpen}>
            <option>Select Group</option>
            <!-- Add other options here -->
          </select>
        </div>
        <div class="form-group">
          <p>Permit_ToDo:</p>
          <select class="createapp-select" bind:value={permitToDo}>
            <option>Select Group</option>
            <!-- Add other options here -->
          </select>
        </div>
        <div class="form-group">
          <p>Permit_Doing:</p>
          <select class="createapp-select" bind:value={permitDoing}>
            <option>Select Group</option>
            <!-- Add other options here -->
          </select>
        </div>
        <div class="form-group">
          <p>Permit_Done:</p>
          <select class="createapp-select" bind:value={permitDone}>
            <option>Select Group</option>
            <!-- Add other options here -->
          </select>
        </div>
      </div>
    </div>
    <div class="button-container">
      <button class="createapp-button" type="submit">Submit</button>
    </div>
  </form>
</div>

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
