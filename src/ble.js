var noble = require('@abandonware/noble');

const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

let mootCharacteristic;

const initBLE = async (setMuteState) => {
	const init = async () => {
		console.log("Scanning...")
		await noble.startScanningAsync([serviceUUID])
	}

	if (noble.state === 'poweredOn') {
		await init()
	}

	noble.on('stateChange', async (state) => {
		if (state === 'poweredOn') {
			await init()
		}
	})

	noble.on('discover', async (peripheral) => {
		console.log("Found peripheral", peripheral.address, peripheral.advertisement.localName)
		await noble.stopScanningAsync();
		await peripheral.connectAsync();

		const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync([serviceUUID], [characteristicUUID]);
		mootCharacteristic = characteristics[0]
		await mootCharacteristic.subscribeAsync()

		mootCharacteristic.on('data', (data) => {
			const value = String.fromCharCode(...data);
			setMuteState(value === "mooted")
		})

		peripheral.on('disconnect', () => {
			console.log('disconnected!')
		})
	})

	const onReceiveMuteStateUpdate = (muted) => {
		// array values : muted (1, 0), brightness (0-60), r, g, b
		mootCharacteristic?.write(muted ? new Uint8Array([1, 10, 255, 34, 0]) : new Uint8Array([0, 10, 21, 255, 0]));
	}

	return { onReceiveMuteStateUpdate }
}

module.exports = { initBLE }