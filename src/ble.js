var noble = require('@abandonware/noble');

const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

let mootCharacteristic;
let mootPeripheral;

let connectedCallbacks = []
let disconnectedCallbacks = []

function registerConnectedCb(fn) {
	connectedCallbacks.push(fn)
}

function registerDisconnectedCb(fn) {
	disconnectedCallbacks.push(fn)
}

const scanBLE = async () => {
	await noble?.startScanningAsync([serviceUUID], false)
	console.log("Scanning...")
}

const initBLE = async (setMuteState) => {
	// noble?.on('stateChange', async (state) => {
	// 	if (state === 'poweredOn') {
	// 		await scanBLE()
	// 	}
	// })

	noble?.on('discover', async (peripheral) => {
		console.log("Found peripheral", peripheral.address, peripheral.advertisement.localName)
		mootPeripheral = peripheral;

		mootPeripheral.once('connect', () => {
			console.log('connected!')
			connectedCallbacks.forEach(fn => fn())
		})

		mootPeripheral.once('disconnect', () => {
			console.log('disconnected!')
			// scanBLE();
			// console.log('trying to reconnect...')
		})

		await setTimeout(() => { }, 300)

		await noble.stopScanningAsync();
		
		// todo handle fail to connect (should time out) - maybe add loading state
		await mootPeripheral.connectAsync();

		const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync([serviceUUID], [characteristicUUID]);
		mootCharacteristic = characteristics[0]
		await mootCharacteristic.subscribeAsync()

		mootCharacteristic.on('data', (data) => {
			const value = String.fromCharCode(...data);
			setMuteState(value === "mooted")
		})
	})

	noble?.on('scanStop', () => {
		console.log("Stopping scan...")
	})

	const onReceiveMuteStateUpdate = (muted) => {
		// array values : muted (1, 0), brightness (0-60), r, g, b
		mootCharacteristic?.write(muted ? new Uint8Array([1, 10, 255, 34, 0]) : new Uint8Array([0, 10, 21, 255, 0]));
	}

	return { onReceiveMuteStateUpdate }
}

async function cleanup() {
	console.log('Cleaning up...')

	await noble?.stopScanningAsync();
	await mootPeripheral?.disconnectAsync();
}

module.exports.initBLE = initBLE;
module.exports.scanBLE = scanBLE;
module.exports.cleanup = cleanup;
module.exports.registerConnectedCb = registerConnectedCb;
module.exports.registerDisconnectedCb = registerDisconnectedCb;