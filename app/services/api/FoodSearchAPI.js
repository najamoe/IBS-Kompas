import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.net";

/**
 * Search for food products by name.
 * @param {string} query - The name of the food product to search for.
 * @param {number} page - Page number for paginated results.
 * @returns {Promise<object[]>} - Array of food products.
 */
export const searchProducts = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/cgi/search.pl`, {
      params: {
        search_terms: query,
        page,
        json: true,
      },
    });

    return response.data.products.map((product) => ({
      name: product.product_name || "Unknown",
      brand: product.brands || "Unknown",
      image: product.image_url || null,
      ingredients: product.ingredients_text || "No ingredients listed",
      nutrition: product.nutriments || {},
      categories: product.categories
        ? product.categories.split(",").map((cat) => cat.trim())
        : [], // Parse and clean categories
    }));
  } catch (error) {
    console.error("Error searching products:", error.message);
    throw error;
  }
};

export default { searchProducts };
