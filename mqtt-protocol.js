const brokerUrl = 'ws://mqtt-plain.nextservices.dk:9001/mqtt';

const client = mqtt.connect(brokerUrl);

const mqttReady = new Promise((resolve, reject) => {
    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        resolve(client); // Resolve the promise when connected
    });

    client.on('error', (err) => {
        console.error(`MQTT Error: ${err.message}`);
        reject(err); // Reject the promise on error
    });
});

export { client, mqttReady }; // Export both the client and the promise