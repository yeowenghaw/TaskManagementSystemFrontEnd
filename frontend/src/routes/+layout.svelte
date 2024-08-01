<script>
  export let data;
  import NavigationBar from "$components/NavigationBar.svelte";
  import { afterUpdate } from "svelte";

  // export async function load({ url, fetch }) {
  //   // Get the current path from the URL
  //   const currentPath = url.pathname;

  //   console.log("function called!");
  //   console.log(currentPath);
  //   // // Check if the current path is not '/login'
  //   // if (currentPath !== '/login') {
  //   //   console.log('Current path is not login. Executing function...');

  //   //   // Call your function here
  //   //   await yourFunction();
  //   // } else {
  //   //   console.log('Current path is login. Skipping function execution.');
  //   // }

  //   // // Return data needed for the layout or page
  //   // return {
  //   //   props: {
  //   //     // Pass any data needed for the layout or page
  //   //   }
  //   // };
  // }

  afterUpdate(() => {
    console.log("DOM has been updated");
    // Perform actions that depend on the updated DOM here
  });
</script>

<NavigationBar {data} />
<slot />

<style>
</style>
