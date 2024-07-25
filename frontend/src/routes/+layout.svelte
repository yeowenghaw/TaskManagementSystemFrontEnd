<script>
  export let data;
  import NavigationBar from "$components/NavigationBar.svelte";
  $: {
    if ("token" in data) {
      console.log("authenticated user logged in");
    } else {
      console.log("no user logged in");
    }
  }
</script>

<NavigationBar {data} />
<slot />

<style>
</style>
