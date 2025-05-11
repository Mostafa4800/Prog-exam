// Reference to the Firestore database
import { db } from "./firebaseInit.js"; // Import the Firestore database instance
import { speed, stopMotor } from "./motorLogic.js"; // Import the motor control functions


// Function to load and display all modules
export async function loadModules() {
    try {
        // Get a reference to the container where modules will be displayed
        const panel = document.getElementById("panel");
        panel.innerHTML = ""; // Clear any existing content

        // Fetch all modules from the Firestore "modules" collection
        const querySnapshot = await db.collection("modules").get();

        if (querySnapshot.empty) {
            panel.innerHTML = "<p>No modules found.</p>";
            return;
        }

        // Iterate through each document in the collection
        querySnapshot.forEach((doc) => {
            const moduleData = doc.data();

            // Create a new div element for each module
            const moduleDiv = document.createElement("div");
            moduleDiv.className = "module";

            // Populate the module div with module details and controls
            moduleDiv.innerHTML = `
                <h3>Module ID: ${moduleData.id}</h3>
                <p>Device Type: ${moduleData.deviceType}</p>
                <p>Min Speed: ${moduleData.minSpeed}</p>
                <p>Max Speed: ${moduleData.maxSpeed}</p>
                <p>Max Microsteps: ${moduleData.maxMicroSteps}</p>
                <p>Timestamp: ${new Date(moduleData.timestamp.seconds * 1000).toLocaleString()}</p>
                <div class="controls">
                    <label for="speed-${moduleData.id}">Speed:</label>
                    <input type="range" id="speed-${moduleData.id}" min="${moduleData.minSpeed}" max="${moduleData.maxSpeed}" value="${moduleData.minSpeed}">
                    <label for="direction-${moduleData.id}">Direction:</label>
                    <select id="direction-${moduleData.id}">
                        <option value="1">Forward</option>
                        <option value="0">Backward</option>
                    </select>
                    <button id="stop-${moduleData.id}">Stop</button>
                </div>
            `;

            // Append the module div to the panel
            panel.appendChild(moduleDiv);

            // Add event listeners for the controls
            const speedSlider = document.getElementById(`speed-${moduleData.id}`);
            const directionSelect = document.getElementById(`direction-${moduleData.id}`);
            const stopButton = document.getElementById(`stop-${moduleData.id}`);

            
            // Slider input event listener for dynamic speed adjustment
            speedSlider.addEventListener("input", () => {
                const selectedSpeed = speedSlider.value; // Ændret variabelnavn
                const direction = directionSelect.value;
                speed(selectedSpeed, moduleData.id, direction); // Kald funktionen 'speed'
            });

            // Direction change event listener for immediate direction switching
            directionSelect.addEventListener("change", () => {
                const selectedSpeed = speedSlider.value; // Ændret variabelnavn
                const direction = directionSelect.value;
                speed(selectedSpeed, moduleData.id, direction); // Kald funktionen 'speed'
            });

            // Stop button event listener
            stopButton.addEventListener("click", () => {
                stopMotor(moduleData.id);
            });
        });
    } catch (error) {
        console.error("Error loading modules:", error);
        alert("Failed to load modules. Check the console for details.");
    }
}



// Call the function to load modules when the page loads
document.addEventListener("DOMContentLoaded", loadModules);