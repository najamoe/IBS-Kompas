import React, { useState, useEffect } from "react";
import { searchProducts } from "../services/api/openFoodFactsApi";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { debounce } from "lodash"; // Import debounce from lodash
import { addFoodIntake } from "../services/firebase/foodService"; // import the Firestore service

const SearchField = ({ userId }) => {
  // Pass userId as a prop
  const [food, setFood] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedItems, setAddedItems] = useState([]);

  // Handle food search input and call the API if the input is longer than 2 characters
  const handleSearch = debounce(async (query) => {
    setFood(query);
    if (query.length >= 3) {
      try {
        const products = await searchProducts(query);
        setSearchResults(products);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  }, 500);

  // Handle item selection and add to Firestore
  const handleSelectItem = async (item) => {
    try {
      // Add selected food item to Firestore
      await addFoodIntake(userId, item, "meal"); // Assuming 'meal' is the type of food entry

      // Update the local state with the added item
      setAddedItems((prevItems) => [...prevItems, item]);
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Food search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={food}
          onChangeText={handleSearch}
          placeholder="Søg efter madvare"
        />
      </View>

      {/* Dropdown with search results */}
      {searchResults.length > 0 && (
        <View style={styles.pickerWrapper}>
          <Text style={styles.resultText}>Søge resultater:</Text>
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelectItem(item)} // Add to Firestore and update UI
              >
                <Text>{`${item.name} - ${item.brand}`}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.pickerList}
            contentContainerStyle={{ maxHeight: 200 }}
          />
        </View>
      )}

      {/* Display added items */}
      <View style={styles.addedItemsContainer}>
        <Text>Added Food Items:</Text>
        {addedItems.length > 0 ? (
          <FlatList
            data={addedItems}
            renderItem={({ item }) => (
              <Text>{`${item.name} - ${item.brand}`}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text>No items added yet.</Text>
        )}
      </View>
    </View>
  );
};

export default SearchField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderColor: "grey",
    flexDirection: "row",
  },
  searchInput: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    flex: 1,
    paddingLeft: 10,
    borderRadius: 20,
  },
  resultText: {
    marginLeft: 10,
  },
  pickerWrapper: {
    borderRadius: 20,
    overflow: "hidden",
  },
  pickerList: {
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    maxHeight: 200,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  addedItemsContainer: {
    marginTop: 20,
  },
});
