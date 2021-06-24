<script>
	export let muteState = false;

	let muteColor = "#ff5656";
	let unmuteColor = "#00D1FF";

	$: cssVars = `--main-color:${muteState ? muteColor : unmuteColor}`;

	function handleClickMain() {
		muteState = !muteState;
		window.api.send("muteStateToMain", muteState);
	}

	window.api.receive("muteStateFromMain", (value) => {
		muteState = value;
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
