// SearchField.js (Child)
import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { searchProducts } from "../services/api/openFoodFactsApi"; // Adjust the import path to where your API file is located

const SearchField = ({ selectedItems, setSelectedItems }) => {
  const [query, setQuery] = useState(""); // Search query
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // Store selected item
  const [itemName, setItemName] = useState(""); // Item name input
  const [quantity, setQuantity] = useState(""); // Quantity input
  const [unit, setUnit] = useState(""); // Unit input

  // Function to handle search input
  const handleSearch = async (query) => {
    setQuery(query);
    if (query.length >= 3) {
      // Trigger search when the query is at least 3 characters
      setLoading(true);
      try {
        // Fetch products based on the search query
        const results = await searchProducts(query);
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
    console.log("Selected item in searchfield:", item);
    setSelectedItem(item); // Store the selected item
    setItemName(item.name); // Store the selected item name
    setShowModal(true); // Show the modal to input quantity and unit
  };

  // Function to handle adding the item with quantity and unit to selectedItems
  const handleAddItem = () => {
    console.log("item from searchfield:", quantity, unit, itemName);

    if (itemName && quantity && unit) {
      const newItem = { ...selectedItem, quantity, unit };
      setSelectedItems((prevItems) => {
        // Directly append new item to the previous items
        return [...prevItems, newItem]; // Directly return the updated array
      });
      setItemName("");
      setQuantity("");
      setUnit("");
      setShowModal(false);
    } else {
      alert("Please enter both quantity and unit.");
    }
  };

  // Function to handle deleting an item from the selected items list
  const handleDeleteItem = (itemToDelete) => {
    setSelectedItems((prevItems) => {
      return prevItems.filter((item) => item !== itemToDelete);
    });
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
                <Text>
                  {item.quantity} {item.unit}
                </Text>
                <MaterialCommunityIcons
                  name="delete-outline"
                  onPress={() => handleDeleteItem(item)} // Handle delete
                  size={24}
                >
        
                </MaterialCommunityIcons>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key
          />
        </View>
      )}

      {/* Modal for quantity and unit input */}
      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Indtast mængde</Text>
              <TextInput
                placeholder="Mængde"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                style={styles.input}
              />
              <RNPickerSelect
                value={unit}
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => {
                  setUnit(value);
                }}
                items={[
                  { label: "gram", value: "gram" },
                  { label: "kg", value: "kg" },
                  { label: "mL", value: "ml" },
                  { label: "dL", value: "dl" },
                  { label: "L", value: "l" },
                ]}
                style={pickerSelectStyles}
                placeholder={{
                  label: "enhed",
                  value: null,
                }}
              />
              <Button title="Tilføj til liste" onPress={handleAddItem} />
              <Button title="Afbryd" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>
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
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
    height: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "grey",
    padding: 10,
  },
  selectedItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  inputAndroid: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
