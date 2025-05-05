// Pairing modules by sending a request to pairing/server and subscribing to pairing/client

import { client, mqttReady } from './Mqtt-protocol.js'; // Import MQTT client and promise

let isMessageListenerAdded = false; // Flag to ensure the message listener is added only once

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

        // Add the message listener only once
        if (!isMessageListenerAdded) {
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
                        rawMessage = rawMessage.replace(/([a-zA-Z0-9_]+):/g, '"$1":'); // Quote property names
                        rawMessage = rawMessage.replace(/: ([a-zA-Z0-9_/]+)/g, ': "$1"'); // Quote string values

                        // Parse the fixed JSON string into a JavaScript object
                        const response = JSON.parse(rawMessage);
                        console.log('Received response from Pairing/Client:', response);

                        // Extract relevant fields from the response
                        const moduleData = {
                            responseTopic: response.ResponseTopic,
                            commandTopic: response.CommandTopic,
                            id: response.ID,
                            deviceType: response.DeviceType,
                            minSpeed: response.MinSpeed,
                            maxSpeed: response.MaxSpeed,
                            maxMicroSteps: response.MaxMicroSteps,
                            timestamp: new Date()
                        };
                        console.log('Parsed module data:', moduleData);

                        // Check if the module ID already exists in Firestore
                        window.db.collection("modules").where("id", "==", moduleData.id).get().then((querySnapshot) => {
                            if (!querySnapshot.empty) {
                                console.log('Module ID already exists in Firestore:', moduleData.id);
                                alert('Module ID already exists. Pairing skipped.');
                                return;
                            }

                            // Add the response to Firestore
                            window.db.collection("modules").add(moduleData).then(() => {
                                alert("Module paired successfully!");
                                loadModules(); // Refresh the module list after the module is added
                            }).catch((error) => {
                                console.error("Error adding to Firebase:", error);
                                alert("Failed to pair module. Check the console for details.");
                            });
                        }).catch((error) => {
                            console.error("Error checking Firestore:", error);
                        });
                    } catch (error) {
                        console.error('Failed to parse message as JSON:', error);
                        console.error('Raw message:', message.toString());
                    }
                }
            });

            isMessageListenerAdded = true; // Set the flag to true
        }
    } catch (error) {
        console.error('Error during pairing process:', error);
    }
    loadModules(); // Refresh the module list
});
