<script>
	import { onMount } from "svelte";

	let config = null;

	onMount(() => {
		config = window.api.sendSync("getConfigState");
	});

	const onClickAlwaysOnTop = () => {
		config.alwaysOnTop = !config.alwaysOnTop;
		window.api.sendSync("updateConfigState", {
			alwaysOnTop: config.alwaysOnTop,
		});
	};
</script>

{#if !config}
	<div />
{:else}
	<div>
		<input
			id="alwaysOnTop"
			type="checkbox"
			checked={config?.alwaysOnTop}
			on:click={onClickAlwaysOnTop}
		/>
		<label for="alwaysOnTop">Always on Top</label>
	</div>
{/if}

<style>
	label {
		display: inline-block;
		-moz-user-select: false;
	}
</style>
