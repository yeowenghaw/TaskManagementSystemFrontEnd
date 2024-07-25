<script>
  export let data;
  let isloggedin = false;
  let isadmin = false;
  $: {
    if ("token" in data) {
      isloggedin = true;
    } else {
      isloggedin = false;
    }
  }
</script>

<div class="navbar">
  <a href="/login">Home</a>
  {#if isloggedin === true}
    <a href="/profile">Profile</a>
    {#if isadmin === true}
      <a href="/usermanagement">UserManagement</a>
    {/if}
    <div class="right">
      <a href="/">LogOut</a>
    </div>
  {/if}
</div>

<style>
  /* Basic styling for the navigation bar */
  .navbar {
    background-color: #333;
    overflow: hidden;
  }
  .navbar a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }
  .navbar a:hover {
    background-color: #ddd;
    color: black;
  }
  .navbar .right {
    float: right;
  }
</style>
