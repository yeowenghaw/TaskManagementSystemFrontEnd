<script>
  export let form;
  $: console.log(form);
</script>

<div class="login">
  <div class="login-container">
    <h2>Login</h2>
    <form action="?/login" method="post">
      <input type="text" id="username" name="username" placeholder="Username" required />
      <br />
      <input type="password" id="password" name="password" placeholder="Password" required />
      <br />
      <input type="submit" value="Login" />
    </form>
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
</div>
