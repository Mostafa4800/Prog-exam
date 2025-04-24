// Pairing modules by sending a request to pairing/server and subscribing to pairing/client

import { client, mqttReady } from './Mqtt-protocol.js'; // Import MQTT client and promise

document.getElementById("pair").addEventListener("click", async function() {
    try {
        // Wait for MQTT connection to be ready
        await mqttReady;

        // Send a pairing request to pairing/server
        const pairingRequest = "hello any modules?";

        client.publish('Pairing/Server', pairingRequest, function(err) {
            if (err) {
                console.error('Failed to send pairing request:', err);
            } else {
                console.log('Pairing request sent to pairing/server');
            }
        });

        // Subscribe to pairing/client to listen for responses
        client.subscribe('Pairing/Client', function(err) {
            if (err) {
                console.error('Failed to subscribe to pairing/client:', err);
            } else {
                console.log('Subscribed to pairing/client');
            }
        });

        // Handle messages from pairing/client
        client.on('message', function(topic, message) {
            if (topic === 'Pairing/Client') {
                try {
                    console.log('Raw message received:', message.toString());

                    // Preprocess the message to fix invalid JSON (if necessary)
                    let rawMessage = message.toString();

                    // Ensure the message starts and ends with curly braces, as valid JSON must be enclosed in them
                    if (!rawMessage.startsWith('{') || !rawMessage.endsWith('}')) {
                        throw new Error('Invalid message format');
                    }

                    // Replace unquoted property names with quoted ones
                    // JSON requires property names to be enclosed in double quotes, but some systems might send unquoted property names.
                    // This regex ensures all property names are properly quoted.
                    rawMessage = rawMessage.replace(/([a-zA-Z0-9_]+):/g, '"$1":'); // Quote property names

                    // Replace unquoted string values with quoted ones
                    // JSON requires string values to be enclosed in double quotes, but some systems might send unquoted string values.
                    // This regex ensures all string values are properly quoted.
                    rawMessage = rawMessage.replace(/: ([a-zA-Z0-9_/]+)/g, ': "$1"'); // Quote string values

                    // Parse the fixed JSON string into a JavaScript object
                    // This step is necessary to work with the data in a structured format.
                    const response = JSON.parse(rawMessage);
                    console.log('Received response from Pairing/Client:', response);

                    // Extract relevant fields from the response
                    // These fields are expected to be part of the response and are used to store module data.
                    const moduleData = {
                        responseTopic: response.ResponseTopic, // Topic to send responses to
                        commandTopic: response.CommandTopic, // Topic to send commands to
                        id: response.ID, // Unique identifier for the module
                        deviceType: response.DeviceType, // Type of the device
                        minSpeed: response.MinSpeed, // Minimum speed supported by the module
                        maxSpeed: response.MaxSpeed, // Maximum speed supported by the module
                        maxMicroSteps: response.MaxMicroSteps, // Maximum microsteps supported by the module
                        timestamp: new Date() // Timestamp of when the module was paired
                    };
                    console.log('Parsed module data:', moduleData);

                    // Check if the module ID already exists in Firestore
                    // This ensures that duplicate modules are not added to the database.
                    window.db.collection("modules").where("id", "==", moduleData.id).get().then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            console.log('Module ID already exists in Firestore:', moduleData.id);
                            alert('Module ID already exists. Pairing skipped.');
                            return; // Exit if the module already exists
                        }

                        // Add the response to Firestore
                        // If the module ID is unique, the module data is added to the Firestore database.
                        window.db.collection("modules").add(moduleData).then(() => {
                            alert("Module paired successfully!");
                        }).catch((error) => {
                            console.error("Error adding to Firebase:", error);
                            alert("Failed to pair module. Check the console for details.");
                        });
                    }).catch((error) => {
                        console.error("Error checking Firestore:", error);
                    });
                } catch (error) {
                    // Handle errors during message parsing or processing
                    console.error('Failed to parse message as JSON:', error);
                    console.error('Raw message:', message.toString());
                }
            }
        });
    } catch (error) {
        console.error('Error during pairing process:', error);
    }
});
