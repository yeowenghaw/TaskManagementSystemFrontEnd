<script>
  import { onMount } from "svelte";
  import axios from "axios";
  let authorization = {
    isprojectlead: false
  };

  const checkPermissions = async () => {
    await handleCheckUser();
  };

  const handleCheckUser = async () => {
    //console.log("checking user...");
    try {
      //console.log("making axios post");
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/auth/user",
        withCredentials: true
      });
      //authorization.isuser = true;
    } catch (error) {
      console.log(error);
      //authorization.isuser = false;
    }
  };

  $: {
    authorization.isuser;
    authorization.isadmin;
    authorization.isprojectlead;
    authorization.isprojectmanager;
    //authorization;
    //console.log(authorization);
    //setContext("authorization", authorization);
  }

  onMount(async () => {
    console.log("main page mounted!");
    checkPermissions();
  });
</script>

<h1>Main Page</h1>
<p>The user is project lead: {authorization.isprojectlead}</p>
