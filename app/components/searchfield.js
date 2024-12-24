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
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const SearchField = () => {
  const [food, setFood] = useState("");
  const [barcodePermission, setBarcodePermission] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false); // State to toggle camera visibility
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

  // Handle barcode scanning
  const handleBarcodeScan = ({ type, data }) => {
    setScanned(true);
    console.log("Scanned barcode data:", data);
    // Optionally, fetch the product info by barcode here
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
          onChange={handleFoodSearch}
          placeholder="søg efter madvare"
        />
        <TouchableOpacity
          onPress={() => setCameraVisible(!cameraVisible)}
          style={styles.barcodeIconContainer}
        >
          <Ionicons name="barcode-sharp" size={30} color="black" />
        </TouchableOpacity>
      </View>

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

      {/* Search results display */}
      <View>
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.resultImage}
                  />
                )}
                <View style={styles.resultTextContainer}>
                  <Text>
                    {item.name} - {item.brand}
                  </Text>
                  <Text>{item.ingredients}</Text>
                </View>
              </View>
            )}
          />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderColor: "grey",
   
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    flex: 1,
    paddingLeft: 10,
    borderRadius: 20,
  },
  barcodeIconContainer: {
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
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
  resultItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  resultImage: {
    width: 50,
    height: 50,
  },
  resultTextContainer: {
    marginLeft: 10,
  },
});
