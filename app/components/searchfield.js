// SearchField.js (Child)
import React, { useEffect, useState } from "react";
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
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import debounce from "lodash.debounce";
import { Searchbar } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import CustomButton from "../components/CustomButton";
import { searchProducts } from "../services/api/FoodSearchAPI"; // Adjust the import path to where your API file is located

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
  const handleSearch = debounce(async (query) => {
    console.log("Searching for:", query);
    setLoading(true);
    try {
      const results = await searchProducts(query);
      console.log("Search results:", results);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Error during search:", error.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  // Function to handle modal close for resetting inputs
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItems([]); // Clear selected items
    setItemName(""); // Reset item name
    setQuantity(""); // Reset quantity
    setUnit(""); // Reset unit
  };

  // Function to handle selecting an item from the dropdown
  const handleSelectItem = (item) => {
    console.log("Selected item in searchfield:", item);
    setSelectedItem(item); // Store the selected item
    setItemName(item.name); // Store the selected item name
    setShowModal(true); // Show the modal to input quantity and unit
  
    //Clearing the search query when an item is selected
    setQuery("");
  };

  // Function to handle adding the item with quantity and unit to selectedItems
  const handleAddItem = () => {
    console.log("item from searchfield:", quantity, unit, itemName);

    if (itemName && quantity && unit) {
      const newItem = { ...selectedItem, name: itemName, quantity, unit };

      setSelectedItems((prevItems) => {
        // Check if an item with the same name already exists
        const existingItemIndex = prevItems.findIndex(
          (item) => item.name === newItem.name
        );

        if (existingItemIndex !== -1) {
          // Replace the existing item with the new one
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = newItem;
          return updatedItems;
        } else {
          // Append the new item to the list
          return [...prevItems, newItem];
        }
      });

      // Reset fields and close modal
      setItemName("");
      setQuantity("");
      setUnit("");
      setShowModal(false);

      setSearchResults([]); // Clear search results
    } else {
      alert("Please enter both quantity and unit.");
    }
  };

  // Function to handle editing an existing item in the selectedItems list
  const handleEditItem = (item) => {
    setSelectedItem(item); // Store the selected item to edit
    setItemName(item.name); // Pre-fill the item name
    setQuantity(item.quantity); // Pre-fill the quantity
    setUnit(item.unit); // Pre-fill the unit
    setShowModal(true); // Open the modal
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
        onChangeText={(text) => {
          setQuery(text);
          handleSearch(text); // Call the debounced search function
        }}
        value={query} // Display the current query state in the input
        loading={loading}
        style={styles.searchbar}
      />

      {/* Dropdown for search results */}
      {searchResults.length > 0 ? (
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
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Ingen resultater fundet</Text>
        </View>
      )}

      {/* List of selected items */}

      <View style={styles.selectedItemsContainer}>
        <Text style={styles.addItemTitle}>Tilføjede varer</Text>

        {/* Conditionally render message if no items are present */}
        {selectedItems.length === 0 ? (
          <Text style={styles.noItemsText}>Ingen varer tilføjet</Text>
        ) : (
          <FlatList
            data={selectedItems}
            renderItem={({ item }) => (
              <View style={styles.selectedItem}>
                <TouchableOpacity onPress={() => handleEditItem(item)}>
                  {/* Left part: Item name, quantity, and unit */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ marginRight: 10 }}>{item.name}</Text>
                    <Text style={{ marginRight: 10 }}>{item.quantity}</Text>
                    <Text>{item.unit}</Text>
                  </View>
                </TouchableOpacity>

                {/* Right part: Delete icon */}
                <TouchableOpacity
                  onPress={() => handleDeleteItem(item)}
                  style={styles.deleteIcon}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key
          />
        )}
      </View>

      {/* Modal for quantity and unit input */}
      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.addItemTitle}>Indtast mængde</Text>
              <View style={{ flexDirection: "row" }}>
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
                    { label: "stk", value: "stk" },
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
              </View>

              <View style={{ flexDirection: "row" }}>
                <CustomButton
                  customStyles={[styles.cancelButton]}
                  title="Afbryd"
                  handlePress={() => setShowModal(false)}
                />

                <CustomButton
                  customStyles={[styles.addButton]}
                  title="Tilføj til liste"
                  handlePress={handleAddItem}
                />
              </View>
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
    flexDirection: "row",
    alignItems: "center", // Vertically align the icon and input field
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 10, // Rounded corners
    borderColor: "grey",
    borderWidth: 0.5,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingHorizontal: 10, // Add padding for inner elements
    height: 50,
  },
  dropdownContainer: {
    maxHeight: 300,
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 0.5,
    elevation: 5,
    position: "absolute",
    top: 66,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  addItemTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  noItemsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  selectedItemsContainer: {
    width: "100%",
    marginTop: 30,
    marginBottom: 240,
    height: 280,
    backgroundColor: "#ffffff",
    elevation: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "grey",
    padding: 10,
  },
  selectedItem: {
    flexDirection: "row", // Place items in a row
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deleteIcon: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
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
    width: "40%",
    marginTop: 20,
    marginRight: 20,
    padding: 10,
    textAlign: "center",
    justifyContent: "center",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cancelButton: {
    backgroundColor: "grey",
    width: "40%",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#86C5D8",
    width: "45%",
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
    marginTop: 20,
  },
});
