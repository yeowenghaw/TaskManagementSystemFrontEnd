<script>
  import axios from "axios";
  import { onMount } from "svelte";

  let userdata;
  let uservalue = "";
  let emailvalue = "";
  let editing = false;

  let temporaryemail = "";
  let temporarypassword = "";
  let errormessage = "";

  // Function to handle form submission
  const handleProfileUpdate = async event => {
    event.preventDefault(); // Prevent default form submission
    console.log("profile update called!");
    try {
      console.log("sending axios call!");
      const response = await axios({
        method: "put",
        url: "http://localhost:3000/api/v1/users/profile",
        data: {
          password: temporarypassword,
          email: temporaryemail
        },
        withCredentials: true
      });
      if (response.status == 200) {
        editing = false;
        emailvalue = temporaryemail;
      }
      //console.log(response);
      errormessage = response.data.message;
    } catch (error) {
      if (error.response.status === "401") {
        console.log(error);
      }
      errormessage = error.response.data.message;
    }
  };

  // Function to handle form submission
  const startEdit = async event => {
    editing = true;
    temporaryemail = emailvalue;
  };

  const getData = async () => {
    const response = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/users/user`,
      withCredentials: true
    });
    userdata = response.data;
    uservalue = response.data.data[0].username;
    emailvalue = response.data.data[0].email;
  };

  onMount(async () => {
    console.log("Page has been navigated to!");
    await getData();
  });
</script>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}
{#if userdata}
  <div class="profile">
    <div class="profile-container">
      <h2>{uservalue}'s Profile</h2>
      <div class="profile-form"></div>
      {#if editing === true}
        <form on:submit|preventDefault={handleProfileUpdate} class="profile-form">
          <h4>Email</h4>
          <input type="text" bind:value={temporaryemail} placeholder={emailvalue} />
          <h4>Password</h4>
          <input type="password" bind:value={temporarypassword} placeholder="********" />
          <button type="submit" class="profile-button">Save</button>
          <button
            on:click={() => {
              editing = false;
            }}
            class="profile-button">Cancel</button
          >
        </form>
      {:else}
        <h4>Email</h4>
        <p>{emailvalue}</p>
        <h4>Password</h4>
        <p>********</p>
        <button type="button" class="profile-button" on:click={startEdit}>Edit</button>
      {/if}
    </div>
  </div>
{:else}
  <p>loading...</p>
{/if}

<style>
  .profile {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .profile-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
  }

  .profile-container h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .profile-form {
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    align-items: center; /* Center elements horizontally */
    gap: 10px; /* Space between elements */
    margin-bottom: 20px; /* Space between forms */
  }

  .profile-form input,
  .profile-form button {
    width: 40%; /* Make inputs and button full width */
    max-width: 300px; /* Optional: set a max-width for better control */
  }

  .profile-container input[type="text"],
  .profile-container input[type="password"] {
    width: auto; /* Allow input to shrink to fit */
    padding: 8px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .profile-button {
    padding: 8px 13px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
  }

  .profile-button:hover {
    background-color: #0056b3;
  }
</style>
