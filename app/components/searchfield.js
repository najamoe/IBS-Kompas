import React, { useState, useEffect } from "react";
import { searchProducts } from "../services/api/openFoodFactsApi";
import { BarcodeScanner } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";

const SearchField = () => {
  const [food, setFood] = useState("");
  const [barcodePermission, setBarcodePermission] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Check barcode permission and set it when the component mounts
  useEffect(() => {
    // If you're using a package that requests permission,
    // you can manage that here, otherwise you can directly allow scanning
    setBarcodePermission(true); // Assuming permission is always granted
  }, []);

  // Handle food search input and call the API if the input is longer than 2 characters
  const handleFoodSearch = async (event) => {
    const query = event.target.value;
    setFood(query);

    if (query.length > 2) {
      try {
        const results = await searchProducts(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching for food:", error);
        setSearchResults([]);
      }
    }
  };

  // Handle barcode scanning (if needed)
  const handleBarcodeScan = (data) => {
    if (data) {
      // Assuming barcode scanner returns the data object
      console.log("Barcode data:", data);
      // You can use the barcode data to fetch product info
    }
  };

  const handleBarcodeError = (err) => {
    console.error("Barcode error:", err);
  };

  return (
    <div>
      {/* Food search input */}
      <input
        type="text"
        value={food}
        onChange={handleFoodSearch}
        placeholder="Search for food"
      />

      {/* Display barcode scanner if permission is granted */}
      {barcodePermission && (
        <div>
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onError={handleBarcodeError}
          />
        </div>
      )}

      {/* Search results display */}
      <div>
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((product, index) => (
              <li key={index}>
                <img src={product.image} alt={product.name} width="50" />
                <p>
                  {product.name} - {product.brand}
                </p>
                <p>{product.ingredients}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchField;
