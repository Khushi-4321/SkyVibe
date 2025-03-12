const API_KEY = "<cpd-apikey-IBMid-694000K2DR-2024-10-08T12:27:41Z>"; // Replace with your API Key
const DEPLOYMENT_URL = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/02333650-8e6b-4a9b-ad1a-7cfd786ad5c7/predictions?version=2021-05-01";

document.getElementById("prediction-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect input values from the form
    const inputValues = [
        Number(document.getElementById("student-age").value),
        document.getElementById("sex").value,
        document.getElementById("high-school-type").value,
        document.getElementById("scholarship").value === "Yes" ? 1 : 0,
        document.getElementById("additional-work").value === "Yes" ? 1 : 0,
        document.getElementById("sports-activity").value === "Yes" ? 1 : 0,
        document.getElementById("transportation").value,
        Number(document.getElementById("weekly-study-hours").value),
        Number(document.getElementById("attendance").value),
        Number(document.getElementById("reading").value),
        Number(document.getElementById("notes").value),
        Number(document.getElementById("listening-in-class").value),
        Number(document.getElementById("project-work").value)
    ];

    try {
        // Get the authentication token
        const token = await getAuthToken(API_KEY);

        // Send the prediction request
        const prediction = await getPrediction(token, inputValues);

        // Display the prediction result
        document.getElementById("result").textContent = `Predicted Result: ${prediction}`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error: Unable to fetch prediction.";
    }
});

// Function to get the IBM Cloud authentication token
async function getAuthToken(apiKey) {
    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
        },
        body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`
    });

    if (!response.ok) {
        throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

// Function to send the prediction request
async function getPrediction(token, inputValues) {
    const payload = {
        input_data: [
            {
                fields: [
                    "Student_Age", 
                    "Sex", 
                    "High_School_Type", 
                    "Scholarship", 
                    "Additional_Work", 
                    "Sports_activity", 
                    "Transportation", 
                    "Weekly_Study_Hours", 
                    "Attendance", 
                    "Reading", 
                    "Notes", 
                    "Listening_in_Class", 
                    "Project_work"
                ],
                values: [inputValues]
            }
        ]
    };

    const response = await fetch(DEPLOYMENT_URL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch prediction: ${response.statusText}`);
    }

    const data = await response.json();
    return data.predictions[0].values[0][0]; // Adjust based on API response structure
}
