<script>
	const ConnectStates = {
		NOT_CONNECTED: "NOT_CONNECTED",
		CONNECTED: "CONNECTED",
		SEARCHING: "SEARCHING",
	};
	export let muteState = false;
	export let connectState = ConnectStates.NOT_CONNECTED;

	let muteColor = "#ff5656";
	let unmuteColor = "#00D1FF";

	$: cssVars = `--main-color:${muteState ? muteColor : unmuteColor}`;

	function handleClickMain() {
		muteState = !muteState;
		window.api.send("muteStateToMain", muteState);
	}

	function handleClickSearch() {
		connectState = ConnectStates.SEARCHING;
		window.api.send("searchForDevices");
	}

	function handleClickDisconnect() {
		connectState = ConnectStates.NOT_CONNECTED;
		window.api.send("disconnect");
	}

	function handleCancelScan() {
		connectState = ConnectStates.NOT_CONNECTED;
		window.api.send("stopScanning");
	}

	window.api.receive("muteStateFromMain", (value) => {
		muteState = value;
	});

	window.api.receive("connectedFromMain", (value) => {
		connectState = ConnectStates.CONNECTED;
	});

	window.api.receive("disconnectedFromMain", (value) => {
		connectState = ConnectStates.NOT_CONNECTED;
	});
</script>

<main style={cssVars}>
	<img class="drag" src="images/drag_indicator.svg" alt="drag" />
	<button class="root" on:click={handleClickMain}>
		<div class="mic {!muteState ? 'nodisplay' : null}">
			<img src="images/MicOff.png" alt="mic on" />
			<div class="text">Mic OFF</div>
		</div>
		<div class="mic on {muteState ? 'nodisplay' : null}">
			<img src="images/MicOn.png" alt="mic on" />
			<div class="text">Mic ON</div>
		</div>
	</button>
	<div class={"connect_container"}>
		{#if connectState === ConnectStates.NOT_CONNECTED}
			<div on:click={handleClickSearch}>
				<div class={"connect_inner search_for_devices"}>
					<img
						class={"state_icon"}
						src="images/SearchIcon.svg"
						alt="search"
					/>
					Search for devices
				</div>
			</div>
		{:else if connectState === ConnectStates.CONNECTED}
			<div class={"connect_inner"} on:click={handleClickDisconnect}>
				<img
					class={"state_icon"}
					src="images/CancelIcon.svg"
					alt="disconnect"
				/>
				Disconnect
			</div>
		{:else if connectState === ConnectStates.SEARCHING}
			<div on:click={handleCancelScan} class={"connect_inner"}>
				<img
					class={"state_icon"}
					src="images/CancelIcon.svg"
					alt="disconnect"
				/>
				Searching..
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	:global(main) {
		height: 100%;
		width: 100%;
		-webkit-user-select: none;
	}

	button:focus {
		border: none;
	}

	.drag {
		-webkit-app-region: drag;
		cursor: -webkit-grab;
		position: absolute;
		right: 0;
		width: 25px;
	}

	.connect_container {
		position: absolute;
		width: 100%;
		bottom: 0;
		right: 0;
		color: #00d1ff;
		background-color: #4f4f4f;
		font-size: 12px;
	}

	.connect_inner {
		display: flex;
		padding: 4px;
		padding-right: 5px;
		align-items: center;
		justify-content: flex-end;
	}

	.search_for_devices {
		/* border: 1px dashed rgba(0, 0, 0, 0.1); */
	}

	.state_icon {
		flex: none;
		height: 1.3em;
		width: 1.3em;
		margin-right: 3px;
	}

	.resize {
		position: absolute;
		bottom: 0;
		right: 0;
		margin: 0.2rem;
		width: 15px;
	}

	.root {
		height: 100%;
		width: 100%;
		background-color: var(--main-color);
	}

	.mic {
		display: flex;
		padding: 1rem;
	}

	.nodisplay {
		display: none;
	}

	img {
		flex: 1;
		width: 10vw;
	}

	.text {
		flex: 2;
		font-size: 14vw;
		margin: auto;
	}
</style>
