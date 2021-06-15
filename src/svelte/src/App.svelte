<script>
	import Router from "svelte-spa-router";
	import Toggle from "./Toggle.svelte";
	import Settings from "./Settings.svelte";

	const routes = {
		"/toggle": Toggle,
		"/settings": Settings,
	};
</script>

<Router {routes} />
