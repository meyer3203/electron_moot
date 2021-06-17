<script>
	import { onMount } from "svelte";

	let config = null;

	onMount(() => {
		config = window.api.sendSync("getConfigState");
	});

	const onClickCheckbox = (key) => {
		config[key] = !config[key];
		window.api.sendSync("updateConfigState", {
			[key]: config[key],
		});
	};
</script>

{#if !config}
	<div />
{:else}
	{#each Object.entries(config) as [key, value]}
		<div>
			<input
				id={key}
				type="checkbox"
				checked={config?.[key]}
				on:click={() => onClickCheckbox(key)}
			/>
			<label for={key}>{key}</label>
		</div>
	{/each}
{/if}

<style>
	label {
		display: inline-block;
		-moz-user-select: false;
	}
</style>
