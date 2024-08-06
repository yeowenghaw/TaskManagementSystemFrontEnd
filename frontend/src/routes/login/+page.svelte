<script>
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { afterUpdate } from "svelte";
  import { onMount } from "svelte";

  let username = "";
  let password = "";
  let errormessage = "";

  // Function to handle form submission
  const handleSubmit = async event => {
    event.preventDefault(); // Prevent default form submission
    var success = false;
    console.log("attempting to log in");
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/auth/login",
        data: {
          username: username,
          password: password
        },
        withCredentials: true
      });

      //console.log(response);
      success = true;
    } catch (error) {
      errormessage = error.response.data.message;
      //alert(error.response.data.message);
    }
    // redirection is done over here because redirecting will trigger the catch error block,
    if (success) {
      window.location.reload();
    }
  };

  const handleToken = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/auth/user",
        withCredentials: true
      });
      goto("/");
    } catch (error) {
      //console.error("Error during authentication:", error.response || error.message);
      //console.log("user not authorized");
    }
  };

  afterUpdate(async () => {
    // console.log("After update has been called");
    // const data = await handleToken();
    // //console.log(data);
    // if (data) {
    //   if (data.status === 200) {
    //     goto("/");
    //   }
    // } else {
    // }
  });

  onMount(async () => {
    // Your code here, this will run once the component is mounted
    console.log("log in on mount is called!");
    await handleToken();
  });
</script>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}
<div class="login">
  <div class="login-container">
    <h2>Login</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <input type="text" bind:value={username} placeholder="Username" required />
      <br />
      <input type="password" bind:value={password} placeholder="Password" required />
      <br />
      <input type="submit" value="Login" />
    </form>
  </div>
</div>

<style>
  .login {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  /* Styling for the login container */
  .login-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
  }

  .login-container h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .login-container input[type="text"],
  .login-container input[type="password"],
  .login-container input[type="submit"] {
    width: 100%;
    padding: 10px;
    margin: 8px 0;
    display: block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .login-container input[type="submit"] {
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }

  .login-container input[type="submit"]:hover {
    background-color: #45a049;
  }
</style>
