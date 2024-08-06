<script>
  export let data;
  import axios from "axios";
  import MultiSelect from "svelte-multiselect";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  // Reactive statement for debugging and handling token
  $: {
    //console.log("value of editingdisabled: " + editingdisabled);
  }

  const checkPermissions = async () => {
    await handleCheckAdmin();
  };

  const setEditingUser = edituser => {
    editingusername = edituser.username;
    editingpassword = "";
    editingemail = edituser.email;
    console.log("value of editing disabled: " + editingdisabled);
    if (edituser.disabled) {
      editingdisabled = "disabled";
    } else {
      editingdisabled = "enabled";
    }
    originaleditinggroup = [];
    data.usergroupdata.data.forEach(element => {
      if (editingusername === element.username) {
        originaleditinggroup.push(element.groupname);
      }
    });
  };

  // Function to handle form submission
  const handleCreateNewUser = async event => {
    let newenabledvalue = false;
    console.log("value of editing disabled: " + newdisabled);
    if (newdisabled === "disabled") {
      newenabledvalue = true;
    }
    console.log("Creating new user");
    console.log({
      data: {
        username: newusername,
        password: newpassword,
        email: newemail,
        disabled: newenabledvalue,
        groups: newgroup
      }
    });

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/users",
        data: {
          username: newusername,
          password: newpassword,
          email: newemail,
          disabled: newenabledvalue,
          groups: newgroup
        },
        withCredentials: true
      });
      if (response.status === 200) {
        newusername = "";
        newpassword = "";
        newemail = "";
        newdisabled = false;
        newgroup = [];
        window.location.reload();
        //errormessage = response.data.message;
      }
    } catch (error) {
      if (error.response.status === "401") {
        goto("/");
      }
      errormessage = error.response.data.message;
    }
  };

  // Function to handle form submission
  const handleUpdateUser = async event => {
    let updatingenabledvalue = false;
    console.log("value of editing disabled: " + editingdisabled);
    if (editingdisabled === "disabled") {
      updatingenabledvalue = true;
    }

    console.log("Updating user: " + editingusername);
    console.log({
      data: {
        username: editingusername,
        password: editingpassword,
        email: editingemail,
        disabled: updatingenabledvalue,
        groups: editinggroup
      }
    });

    try {
      const response = await axios({
        method: "put",
        url: "http://localhost:3000/api/v1/users",
        data: {
          username: editingusername,
          password: editingpassword,
          email: editingemail,
          disabled: updatingenabledvalue,
          groups: editinggroup
        },
        withCredentials: true
      });
      if (response.status === 200) {
        editingusername = "";
        editingpassword = "";
        editingemail = "";
        editingdisabled = "enabled";
        editinggroup = [];
        window.location.reload();
        //errormessage = response.data.message;
      }
    } catch (error) {
      if (error.response.status === "401") {
        goto("/");
      }
      errormessage = error.response.data.message;
    }
  };

  // Function to handle form submission
  const handleCreateGroup = async event => {
    console.log("Creating group: " + createnewgroup);
    console.log({
      data: {
        groupname: createnewgroup
      }
    });

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/groups",
        data: {
          groupname: createnewgroup
        },
        withCredentials: true
      });
      if (response.status === 200) {
        createnewgroup = "";
        window.location.reload();
        //errormessage = response.data.message;
      }
    } catch (error) {
      if (error.response.status === "401") {
        goto("/");
      }
      errormessage = error.response.data.message;
    }
  };

  const handleCheckAdmin = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/auth/admin",
        withCredentials: true
      });
      return response;
    } catch (error) {
      //console.error("Error during authentication:", error.response || error.message);
      console.log("user is not an Admin");
      goto("/");
    }
  };

  onMount(async () => {
    // Your code here, this will run once the component is mounted
    console.log("usermanagement on mount is called!");
    checkPermissions();
  });

  let newusername;
  let newpassword;
  let newemail;
  let newdisabled = "enabled";
  let newgroup = [];

  let createnewgroup = "";

  let editingusername = "";
  let editingpassword;
  let editingemail;
  let editingdisabled = "enabled";
  let editinggroup = [];
  let originaleditinggroup = [];

  let errormessage = "";
</script>

{#if errormessage.length > 0}
  <h2>{errormessage}</h2>
{/if}

<h1>User Management</h1>
{#if data.userdata || data.usergroupdata}
  <form>
    <input type="text" bind:value={createnewgroup} />
    <button on:click={handleCreateGroup}>Create Group</button>
  </form>
  <table id="userTable">
    <thead>
      <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Password</th>
        <th>Group</th>
        <th>Status</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      {#each data.userdata.data as user}
        {#if user.username !== "-"}
          <tr>
            {#if user.username === editingusername}
              {#if editingusername === "admin"}
                <td>{editingusername}</td>
                <td><input type="text" bind:value={editingemail} /></td>
                <td><input type="password" bind:value={editingpassword} /></td>
                <td>
                  <ul>
                    {#each data.usergroupdata.data as usergroup}
                      {#if usergroup.username === user.username}
                        <li>{usergroup.groupname}</li>
                      {/if}
                    {/each}
                  </ul>
                </td>
                <td>
                  {#if user.disabled === 0}
                    <p>Enabled</p>
                  {:else}
                    <p>Disabled</p>
                  {/if}
                </td>
                <td
                  ><button on:click={handleUpdateUser}>Save</button>

                  <button
                    on:click={() => {
                      editingusername = "";
                    }}>Cancel</button
                  ></td
                >
              {:else}
                <td>{editingusername}</td>
                <td><input type="text" bind:value={editingemail} /></td>
                <td><input type="password" bind:value={editingpassword} /></td>
                <td>
                  <MultiSelect options={data.groupdata.data.map(item => item.groupname)} placeholder="Select Groups" bind:value={editinggroup} selected={originaleditinggroup} style="width: 200px;" />
                </td>
                <td>
                  <select bind:value={editingdisabled}>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </td>
                <td
                  ><button on:click={handleUpdateUser}>Save</button>

                  <button
                    on:click={() => {
                      editingusername = "";
                    }}>Cancel</button
                  ></td
                >
              {/if}
            {:else}
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>********</td>
              <td>
                <ul>
                  {#each data.usergroupdata.data as usergroup}
                    {#if usergroup.username === user.username}
                      <li>{usergroup.groupname}</li>
                    {/if}
                  {/each}
                </ul>
              </td>
              <td>
                {#if user.disabled === 0}
                  <p>Enabled</p>
                {:else}
                  <p>Disabled</p>
                {/if}
              </td>
              <td><button on:click={setEditingUser(user)}>Edit</button> </td>
            {/if}
          </tr>
        {/if}
      {/each}

      <tr>
        <td><input type="text" bind:value={newusername} /></td>
        <td><input type="text" bind:value={newemail} /></td>
        <td><input type="password" bind:value={newpassword} /></td>
        <td>
          <MultiSelect options={data.groupdata.data.map(item => item.groupname)} placeholder="Select Groups" bind:value={newgroup} style="width: 200px;" />
        </td>
        <td>
          <select bind:value={newdisabled}>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </td>
        <td>
          <form on:submit={handleCreateNewUser}>
            <button>Create</button>
          </form>
        </td>
      </tr>
    </tbody>
  </table>
{:else}
  <p>No data</p>
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
</style>
