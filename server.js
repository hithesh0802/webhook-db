const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/srdarknighter/website_data/refs/heads/main/db-scraped-data.json"; 

app.post("/webhook", async (req, res) => {
    const intent = req.body.queryResult.intent.displayName;

    try {
        const response = await fetch(GITHUB_JSON_URL);
        const data = await response.json();
        let fulfillmentText = "Sorry, I don't have that information.";

        if (intent === "Admission Information") {
            fulfillmentText = data["Admission Information"]?.general_info || fulfillmentText;
        } else if (intent === "Courses Offered") {
            fulfillmentText = `We offer: ${data["Courses Offered"].undergraduate.join(", ")}`;
        } else if (intent === "Fee Structure") {
            fulfillmentText = `B.Tech fees: ${data["Fee Structure"].B.Tech}`;
        } else if (intent === "Placement Information") {
            fulfillmentText = `Highest package: ${data["Placement Information"].highest_package}`;
        } else if (intent === "Scholarship Opportunities") {
            fulfillmentText = `Scholarships: ${data["Scholarship Opportunities"].merit_scholarships}`;
        }

        return res.json({ fulfillmentText });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.json({ fulfillmentText: "Error fetching data. Please try again later." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
