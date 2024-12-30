import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { searchProducts } from "../services/api/openFoodFactsApi"; // Adjust the import path to where your API file is located

const SearchField = () => {
  const [query, setQuery] = useState(""); // Search query
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedItems, setSelectedItems] = useState([]); // Selected items
  const [page, setPage] = useState(1); // Current page for pagination

  // Function to handle search input
  const handleSearch = async (query) => {
    setQuery(query);
    if (query.length >= 3) {
      // Trigger search when the query is at least 3 characters
      setLoading(true);
      try {
        // Fetch products based on the search query and current page
        const results = await searchProducts(query, page);
        setSearchResults(results); // Update state with new search results
      } catch (error) {
        setSearchResults([]); // Reset results if there is an error
      }
      setLoading(false);
    } else {
      setSearchResults([]); // Clear results if query is too short
    }
  };

  // Function to handle selecting an item from the dropdown
  const handleSelectItem = (item) => {
    console.log("Selected item:", item);

    // Add the selected item to the selectedItems list
    setSelectedItems((prevItems) => [...prevItems, item]);

    // Close the dropdown by clearing search results
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <Searchbar
        placeholder="Søg efter madvare"
        onChangeText={handleSearch}
        value={query}
        loading={loading}
        style={styles.searchbar}
      />

      {/* Dropdown for search results */}
      {searchResults.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelectItem(item)} // Handle item selection
              >
                <Text>{item.name}</Text>
                <Text>{item.brand}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key since product might not have unique ids
          />
        </View>
      )}

      {/* List of selected items */}
      {selectedItems.length > 0 && (
        <View style={styles.selectedItemsContainer}>
          <Text>Tilføjede varer</Text>
          <FlatList
            data={selectedItems}
            renderItem={({ item }) => (
              <View style={styles.selectedItem}>
                <Text>{item.name}</Text>
                <Text>{item.brand}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key
          />
        </View>
      )}
    </View>
  );
};

export default SearchField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",

    width: "100%",
  },
  searchbar: {
    width: "100%",
    flexDirection: "row",
  },
  dropdownContainer: {
    marginTop: 10,
    maxHeight: 200,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 0.5,
    position: "absolute",
    top: 26, // Adjust based on search bar position
    left: 30,
    right: 0,
    zIndex: 1,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedItemsContainer: {
    marginTop: 20,
    width: "100%",
    height: 200,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "grey",
  },
  selectedItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});


