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
import { addFoodIntake, deleteFoodIntake } from "../services/firebase/foodService"; // import the Firestore service

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
  const handleSelectItem = async (item, type) => {
    try {
      // Add selected food item to Firestore with the specified type
      await addFoodIntake(userId, item, type);

      // Update the local state with the added item
      setAddedItems((prevItems) => [...prevItems, item]);
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  const handleBreakfastSelect = (item) => {
    handleSelectItem(item, "breakfast");
  };

  const handleLunchSelect = (item) => {
    handleSelectItem(item, "lunch");
  };

    const handleDinnerSelect = (item) => {
      handleSelectItem(item, "dinner");
    };

  const handleSnackSelect = (item) => {
    handleSelectItem(item, "snack");
  };

  const handleRemoveItem = async (item) => {
    try {
      // Remove selected food item from Firestore
      await deleteFoodIntake(userId, item);
      setAddedItems((prevItems) =>
        prevItems.filter((addedItem) => addedItem.id !== item.id)
      );
    } catch (error) {
      console.error("Error removing food item:", error);
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
        <Text>Tilføjede madvarer:</Text>
        {addedItems.length > 0 ? (
          <FlatList
            data={addedItems}
            style={styles.addedItemsList}
            renderItem={({ item }) => (
              <View style={styles.addedItem}>
                <Text>{`${item.name} - ${item.brand}`}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveItem(item)} // Remove from Firestore and update UI
                >
                  <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.addedItemText}>Ingen varer tilføjet.</Text>
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
  addedItemText: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
  addedItemsList: {
    marginTop: 10,
    flexDirection: "row",
  },
  addedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 5,
  },
  deleteButton: {
    backgroundColor: "#d5d7db",
    borderRadius: 100,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 50, 
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
  },
});
