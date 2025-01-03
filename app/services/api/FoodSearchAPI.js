import axios from "axios";

const API_KEY = "9cb90b57ed2243d880531c5041bafea4"; // Store API key securely in environment variables
const BASE_URL = "https://api.spoonacular.com/food/products/search";

async function searchProducts(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apiKey: API_KEY,
        query: query,
        number: 10, // Adjust number based on how many results you want
      },
    });

    // Check if the response has the expected structure
    if (response && response.data && response.data.products) {
      console.log("Products retrieved:", response.data.products); // Optional: Log the products
      return response.data.products; // Return the list of products
    } else {
      console.error("No products found in response");
      return [];
    }
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );
    throw error; // Propagate error to caller
  }
}

export { searchProducts };
