import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { searchProducts } from "../services/api/openFoodFactsApi";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import debounce from "lodash.debounce";

const SearchField = () => {
  const [food, setFood] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
          <Picker
            selectedValue={food}
            onValueChange={(itemValue) => setFood(itemValue)}
            style={styles.picker}
          >
            {searchResults.map((item, index) => (
              <Picker.Item
                key={index}
                label={`${item.name} - ${item.brand}`}
                value={item.name}
              />
            ))}
          </Picker>
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
  pickerWrapper: {
    borderRadius: 40,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
});
