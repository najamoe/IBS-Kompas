import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.net";

export const searchProducts = async (query, page = 1) => {
  try {
    //Http request
    const response = await axios.get(`${BASE_URL}/cgi/search.pl`, {
      params: {
        search_terms: query,
        page,
        json: true,
      },
    });
    //Mapping response data
    return response.data.products.map((product) => ({
      name: product.product_name || "Unknown",
      brand: product.brands || "Unknown",
      image: product.image_url || null,
      categories: product.categories
        ? product.categories.split(",").map((cat) => cat.trim())
        : [],
      nutriment: {
        energy: product.nutriments["energy-kcal_value"] || 0,
        fat: product.nutriments.fat || 0,
        carbohydrates: product.nutriments.carbohydrates || 0,
        proteins: product.nutriments.proteins || 0,
        fiber: product.nutriments.fiber || 0,
        salt: product.nutriments.salt || 0,
        sugars: product.nutriments.sugars || 0,
      },
    }));
  } catch (error) {
    console.error("Error searching products:", error.message);
    throw error;
  }
};

export default { searchProducts };


