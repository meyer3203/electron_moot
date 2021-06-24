<script>
	import { onMount } from "svelte";
	import Checkbox from "@smui/checkbox/styled";
	import FormField from "@smui/form-field/styled";

	let config = null;

	onMount(() => {
		config = window.api?.sendSync("getConfigState");
	});

	const onClickCheckbox = (e) => {
		const key = e.target.value;
		config[key] = !config[key];
		window.api?.sendSync("updateConfigState", {
			[key]: config[key],
		});
	};
</script>

<div class="root">
	<div style={"display: flex; flex-direction: column; padding: 30px;"}>
		<img
			src="images/MootLogo.svg"
			alt="moot_logo"
			style={"width: 50%; align-self:flex-end; margin-bottom: 50px; -webkit-app-region: drag; cursor: -webkit-grab;"}
		/>
		<FormField style={"margin-bottom: 20px;"}>
			<Checkbox
				value="alwaysOnTop"
				checked={config?.["alwaysOnTop"]}
				on:click={onClickCheckbox}
			/>
			<span slot="label">Always on top</span>
		</FormField>
		<span
			style={"font-size: 16px; background: #55595d; padding: 20px; margin-bottom: 30px;"}
		>
			Moot works by controlling your computers microphone, making it
			compatible with all video conferencing applications. If you would
			like your device to sync with the following, please select the
			option.
		</span>
		<FormField style={"margin-bottom: 20px;"}>
			<Checkbox
				value="zoomSync"
				checked={config?.["zoomSync"]}
				on:click={onClickCheckbox}
			/>
			<span slot="label">Sync with Zoom</span>
		</FormField>
		<FormField>
			<Checkbox
				value="webexSync"
				checked={config?.["webexSync"]}
				on:click={onClickCheckbox}
			/>
			<span slot="label">Sync with Webex</span>
		</FormField>
	</div>
</div>

<style>
	.root {
		background: linear-gradient(
				180deg,
				rgba(0, 0, 0, 0.59) 0%,
				rgba(0, 0, 0, 0) 100%
			),
			#4f4f4f;
		width: 100%;
		height: 100%;

		-webkit-app-region: drag;
		cursor: -webkit-grab;
	}

	span {
		color: #00d1ff;
		font-size: 24px;
		font-weight: 600;
	}
</style>
