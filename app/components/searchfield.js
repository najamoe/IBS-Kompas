import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { searchProducts } from "../services/api/openFoodFactsApi";
import { Camera } from "expo-camera";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import debounce from "lodash.debounce";

const SearchField = () => {
  const [food, setFood] = useState("");
  const [barcodePermission, setBarcodePermission] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  // Request camera permission when the component mounts
  useEffect(() => {
    const getBarcodePermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setBarcodePermission(status === "granted");
    };

    getBarcodePermission();
  }, []);

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

  // Handle barcode scanning
  const handleBarcodeScan = ({ type, data }) => {
    setScanned(true);
    console.log("Scanned barcode data:", data);
  };

  // Reset the scanned state
  const handleScanAgain = () => {
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      {/* Food search input and barcode icon */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={food}
          onChangeText={handleSearch}
          placeholder="søg efter madvare"
        />
        <TouchableOpacity
          onPress={() => setCameraVisible(!cameraVisible)}
          style={styles.barcodeIconContainer}
        >
          <Ionicons name="barcode-sharp" size={30} color="black" />
        </TouchableOpacity>
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

      {/* Display barcode scanner if permission is granted */}
      {barcodePermission === null && (
        <Text>Requesting camera permission...</Text>
      )}
      {barcodePermission === false && <Text>Ingen adgang til kamera</Text>}
      {barcodePermission &&
        !scanned &&
        Camera.Constants &&
        Camera.Constants.Type && (
          <View style={styles.cameraContainer}>
            <Camera
              ref={setCameraRef}
              style={styles.camera}
              onBarCodeScanned={handleBarcodeScan}
              type={Camera.Constants.Type.back}
            >
              <Text style={styles.scanInstruction}>Scan a barcode</Text>
            </Camera>
          </View>
        )}
      {scanned && <Button title={"Scan Again"} onPress={handleScanAgain} />}
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
  barcodeIconContainer: {
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    marginLeft: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  pickerWrapper: {
    borderRadius: 40, 
    overflow: "hidden", 
  },
  cameraContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  camera: {
    height: 200,
    width: 200,
  },
  scanInstruction: {
    backgroundColor: "white",
    padding: 5,
  },
});
