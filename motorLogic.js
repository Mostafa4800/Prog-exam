import { client } from './Mqtt-protocol.js'; // Import the client and the promise

export function speed(Speed, DeviceId, Direction) {
    const deviceId = String(DeviceId).trim();
    const speed = String(Speed).trim();
    const Dir = String(Direction).trim();

    if (!client || !client.connected) {
        console.error('MQTT client is not connected');
        return;
    }

    if (Dir !== '1' && Dir !== '0') {
        console.error('Invalid direction value. Use 1 for forward and 0 for backward.');
        return;
    }

    if (isNaN(speed) || speed < 0 || speed > 10) {
        console.error('Invalid speed value');
        return;
    }

    if (!deviceId || deviceId.trim() === '') {
        console.error('Invalid device ID');
        return;
    }

    const message = JSON.stringify({
        Steps: "Run",
        Speed: speed,
        Dir: Dir,
        MicroSteps: 256
    });

    if (message) {
        client.publish("ESPStepper" + deviceId + "/Motor", message, () => {
            console.log(`Message published: ${message}`);
        });
    } else {
        console.error('Message cannot be empty');
    }
}

export function stopMotor(DeviceId) {
    const deviceId = String(DeviceId).trim();

    if (!client || !client.connected) {
        console.error('MQTT client is not connected');
        return;
    }

    if (!deviceId || deviceId.trim() === '') {
        console.error('Invalid device ID');
        return;
    }

    const message = JSON.stringify({
        Steps: "Stop",
        Speed: "0",
        Dir: "0",
        MicroSteps: 256
    });

    if (message) {
        client.publish("ESPStepper" + deviceId + "/Motor", message, () => {
            console.log(`Message published: ${message}`);
        });
    } else {
        console.error('Message cannot be empty');
    }
}


