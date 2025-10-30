import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini() {
  try {
    const response = await axios.post(
      "https://gemini.api.google.com/v1/your-endpoint", // Replace with actual Gemini endpoint
      {
        prompt: "Hello, Gemini AI!",
        // Other request data as per Gemini API
      },
      {
        headers: {
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
  }
}

callGemini();
