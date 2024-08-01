<script>
  export let data;
  import axios from "axios";
  import MultiSelect from "svelte-multiselect";
  import { beforeNavigate, afterNavigate } from "$app/navigation";

  // Reactive statement for debugging and handling token
  $: {
  }

  const setEditingUser = edituser => {
    editingusername = edituser.username;
    editingpassword = "";
    editingemail = edituser.email;
    editingdisabled = edituser.disabled;
    originaleditinggroup = [];
    data.usergroupdata.data.forEach(element => {
      if (editingusername === element.username) {
        originaleditinggroup.push(element.groupname);
      }
    });
  };

  // Function to handle form submission
  const handleCreateNewUser = async event => {
    console.log("Creating new user");
    console.log({
      data: {
        username: newusername,
        password: newpassword,
        email: newemail,
        disabled: newdisabled,
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
          disabled: newdisabled,
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
      // if (error.response.status === "401") {
      //   try {
      //     const response = await axios({
      //       method: "post",
      //       url: "http://localhost:3000/api/v1/logout",
      //       withCredentials: true
      //     });

      //     console.log(response);

      //     if (response.status === 200) {
      //       // Check for successful response status
      //       goto("/login"); // Use relative path for better consistency
      //     } else {
      //       console.error("Logout failed:", response.status, response.statusText);
      //     }
      //   } catch (error) {
      //     console.error("Error during logout:", error.response || error.message);
      //   }
      // }
      errormessage = error.response.data.message;
    }
  };

  // Function to handle form submission
  const handleUpdateUser = async event => {
    console.log("Updating user: " + editingusername);
    console.log({
      data: {
        username: editingusername,
        password: editingpassword,
        email: editingemail,
        disabled: editingdisabled,
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
          disabled: editingdisabled,
          groups: editinggroup
        },
        withCredentials: true
      });
      if (response.status === 200) {
        editingusername = "";
        editingpassword = "";
        editingemail = "";
        editingdisabled = false;
        editinggroup = [];
        window.location.reload();
        //errormessage = response.data.message;
      }
    } catch (error) {
      // if (error.response.status === "401") {
      //   try {
      //     const response = await axios({
      //       method: "post",
      //       url: "http://localhost:3000/api/v1/logout",
      //       withCredentials: true
      //     });

      //     console.log(response);

      //     if (response.status === 200) {
      //       // Check for successful response status
      //       goto("/login"); // Use relative path for better consistency
      //     } else {
      //       console.error("Logout failed:", response.status, response.statusText);
      //     }
      //   } catch (error) {
      //     console.error("Error during logout:", error.response || error.message);
      //   }
      // }
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
      errormessage = error.response.data.message;
    }
  };

  let newusername;
  let newpassword;
  let newemail;
  let newdisabled = false;
  let newgroup = [];

  let createnewgroup = "";

  let editingusername = "";
  let editingpassword;
  let editingemail;
  let editingdisabled = false;
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
                <input type="checkbox" bind:checked={editingdisabled} />Disabled?
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
      {/each}

      <tr>
        <td><input type="text" bind:value={newusername} /></td>
        <td><input type="text" bind:value={newpassword} /></td>
        <td><input type="password" bind:value={newemail} /></td>
        <td>
          <MultiSelect options={data.groupdata.data.map(item => item.groupname)} placeholder="Select Groups" bind:value={newgroup} style="width: 200px;" />
        </td>
        <td>
          <input type="checkbox" bind:checked={newdisabled} />Disabled?
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

<!-- <select bind:value={newgroup} multiple>
  <option>NIL</option>
  {#each data.groupdata.data as group}
    <option>{group.groupname}</option>
  {/each}
</select> -->
<!-- <MultiSelect id="languages" options={data.groupdata.data} placeholder="What languages do you know?" selected={[]}>
  <LanguageSlot let:option {option} slot="selected" />
  <LanguageSlot let:option {option} slot="option" />
</MultiSelect> -->

<!-- <form>
  <label for="fruits">Choose fruits:</label>
  <select id="fruits" name="fruits" multiple>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
      <option value="date">Date</option>
      <option value="elderberry">Elderberry</option>
  </select>

  <br><br>
  <input type="submit" value="Submit">
</form> -->

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
  .multi-select {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    width: 200px; /* Specify the desired width here */
    max-height: 150px;
    overflow-y: auto;
    position: relative;
  }
</style>
