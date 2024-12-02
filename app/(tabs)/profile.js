import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Icon from "react-native-vector-icons/FontAwesome";
import { signOutUser, deleteUserAccount } from "../firebase/auth";
import CustomButton from "../components/CustomButton";
import firebaseConfig from "../firebase/FirebaseConfig";
import {
  fetchUserDetails,
  updateUserDetails,
} from "../firebase/firestoreService";
import icon from "../../assets/icon.png";

const { auth } = firebaseConfig;

const allergyOptions = [
  { label: "Laktose", value: "laktose" },
  { label: "Mælk", value: "mælk" },
  { label: "Gluten", value: "gluten" },
  { label: "Hvede", value: "hvede" },
  { label: "Løg", value: "løg" },
  { label: "Hvidløg", value: "hvidløg" },
  { label: "Æg", value: "æg" },
  { label: "Skaldyr", value: "skaldyr" },
  { label: "Soja", value: "soja" },
  { label: "Jordnød", value: "jordnød" },
];

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [ibsType, setIbsType] = useState(null);
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const [gender, setGender] = useState("");
  const [waterGoal, setWaterGoal] = useState(userData?.waterGoal || "");

  useEffect(() => {
    const getUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No authenticated user.");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchUserDetails(user.uid);

        setUserData(data);
        if (data.gender) setGender(data.gender);  
        if (data.allergies) setSelectedAllergies(data.allergies);
        if (data.birthday) setDate(new Date(data.birthday));
        if (data.WaterGoal) setWaterGoal(data.WaterGoal);
        if (data.ibsType) setIbsType(data.ibsType);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !editingField || !editedValue) return;

    try {
      // Update the respective field based on `editingField`
      await updateUserDetails(user.uid, { [editingField]: editedValue });

      // Update userData state to reflect the change
      setUserData((prevData) => ({
        ...prevData,
        [editingField]: editedValue, // Dynamically update the corresponding field
      }));

      console.log(`${editingField} updated successfully!`);
      setEditingField(null); // Close the edit mode
      setEditedValue(""); // Reset the edited value
    } catch (error) {
      console.error(`Error updating ${editingField}:`, error);
    }
  };

  const handleFieldEdit = (field) => {
    setEditingField(field); // Set the field that is being edited (e.g., name, email)
    setEditedValue(userData[field] || ""); // Preload the field value if it exists
  };

  const handleAllergyChange = (selectedItems) => {
    setSelectedAllergies(selectedItems);
    saveAllergiesToFirestore(selectedItems);
  };

  const saveAllergiesToFirestore = async (allergies) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateUserDetails(user.uid, { allergies });
    } catch (error) {}
  };

  const getUserField = (field) => {
    return userData && userData[field] ? userData[field] : "Ikke indtastet";
  };

  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const saveBirthdayToFirestore = async (selectedDate) => {
    const user = auth.currentUser;
    if (!user) return;

    const formattedDate = formatDateToDDMMYYYY(selectedDate);

    try {
      await updateUserDetails(user.uid, { birthday: formattedDate });
      setUserData((prevData) => ({
        ...prevData,
        birthday: formattedDate,
      }));
      console.log("Birthday updated successfully!");
    } catch (error) {
      console.error("Error updating birthday in Firestore:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      console.log("Delete account function triggered");
      await deleteUserAccount();
      setModalVisible(false);
    } catch (error) {
      console.error("Something went wrong with account deletion", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView>
          <Image source={icon} style={styles.icon} />
          <View style={styles.profileContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Name:</Text>
              {editingField === "name" ? (
                <TextInput
                  style={styles.inputField}
                  value={editedValue}
                  onChangeText={setEditedValue}
                  placeholder="Navn"
                />
              ) : (
                <Text>{userData?.name || "Ikke indtastet"}</Text>
              )}
              {editingField === "name" ? (
                <Button title="Gem" onPress={handleSave} />
              ) : (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => handleFieldEdit("name")}
                >
                  <Icon name="edit" size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email:</Text>
              {editingField === "email" ? (
                <TextInput
                  style={styles.inputField}
                  value={editedValue}
                  onChangeText={setEditedValue}
                  placeholder="Email"
                />
              ) : (
                <Text>{userData?.email || "Ikke indtastet"}</Text>
              )}
              {editingField === "email" ? (
                <Button title="Gem" onPress={handleSave} />
              ) : (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => handleFieldEdit("email")}
                >
                  <Icon name="edit" size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Køn:</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  value={gender}
                  onValueChange={(value) => {
                    if (userData) {
                      if (value !== gender) {
                        updateUserDetails(userData.uid, { gender: value })
                          .then(() => {
                            setGender(value);
                          })
                          .catch((error) => {
                            console.error("Error updating gender:", error);
                          });
                      }
                    }
                  }}
                  items={[
                    { label: "Mand", value: "mand" },
                    { label: "Kvinde", value: "kvinde" },
                    { label: "Andet", value: "andet" },
                    { label: "Ønsker ikke at oplyse", value: "ikkeoplyst" },
                  ]}
                  style={{
                    inputAndroid: styles.pickerInput,
                    placeholder: styles.placeholderText,
                  }}
                  placeholder={{
                    label: "Vælg køn",
                    value: null,
                  }}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Fødselsdato:</Text>
              <View style={styles.birthdayContainer}>
                <Text style={styles.profileText}>
                  {loading ? "Henter Fødselsdato..." : getUserField("birthday")}
                </Text>
                <TouchableOpacity
                  onPress={() => setPickerVisible(true)}
                  style={styles.iconContainer}
                >
                  <Icon name="edit" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {pickerVisible && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setPickerVisible(false);
                    setDate(selectedDate);
                    saveBirthdayToFirestore(selectedDate);
                  } else {
                    setPickerVisible(false);
                  }
                }}
              />
            )}

            <View style={styles.allergyFieldContainer}>
              <Text style={styles.fieldLabel}>
                Kendte allergier & intolerancer:
              </Text>
              <View style={styles.dropdownContainer}>
                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={allergyOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Vælg allergi"
                  value={selectedAllergies}
                  search
                  searchPlaceholder="Søg..."
                  onChange={handleAllergyChange}
                  renderItem={(item) => (
                    <View style={styles.item}>
                      <Text style={styles.selectedTextStyle}>{item.label}</Text>
                    </View>
                  )}
                  renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity
                      onPress={() => unSelect && unSelect(item)}
                    >
                      <View style={styles.selectedItem}>
                        <Text style={styles.selectedText}>{item.label}</Text>
                        <AntDesign
                          color="black"
                          name="delete"
                          size={16}
                          marginLeft="8"
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>IBS Type:</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  value={ibsType}
                  onValueChange={(value) => {
                    if (userData) {
                      if (value !== ibsType) {
                        updateUserDetails(userData.uid, { ibsType: value })
                          .then(() => {
                            setIbsType(value);
                          })
                          .catch((error) => {
                            console.error("Error updating ibsType:", error);
                          });
                      }
                    }
                  }}
                  items={[
                    { label: "IBS-D", value: "IBS-D" },
                    { label: "IBS-C", value: "IBS-C" },
                    { label: "IBS-M", value: "IBS-M" },
                    { label: "Ved ikke", value: "Ved ikke" },
                  ]}
                  style={{
                    inputAndroid: styles.pickerInput,
                    placeholder: styles.placeholderText,
                  }}
                  placeholder={{
                    label: "Vælg IBS Type",
                    value: null,
                  }}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Dagligt Vandmål (liter):</Text>
              {editingField === "waterGoal" ? (
                <TextInput
                  style={styles.inputField}
                  value={editedValue}
                  onChangeText={setEditedValue}
                  keyboardType="numeric"
                  placeholder="Dagligt mål i liter"
                />
              ) : (
                <Text>{userData?.waterGoal || "Ikke indtastet"}</Text>
              )}
              {editingField === "waterGoal" ? (
                <Button title="Gem" onPress={handleSave} />
              ) : (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => handleFieldEdit("waterGoal")}
                >
                  <Icon name="edit" size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <CustomButton
              title="Sign Out"
              style={styles.signOutButton}
              handlePress={() => {
                console.log("Sign Out button pressed");
                signOutUser();
              }}
            />
            <CustomButton
              title="Slet konto"
              style={styles.DeleteButton}
              handlePress={() => {
                console.log("Delete account button pressed");
                setModalVisible(true);
              }}
              iconName="trash"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainerDelete}>
          <View style={styles.modalContentDelete}>
            <Text style={styles.modalTitleDelete}>Slet konto</Text>
            <Text>Er du sikker på du ønsker at slette din konto?</Text>
            <Text>Handlingen kan ikke fortrydes</Text>
            <CustomButton
              title="Ja, slet konto"
              handlePress={handleDeleteUser}
            />
            <CustomButton
              title="Nej, slet ikke min konto"
              handlePress={() => {
                console.log("Cancel button pressed");
                setModalVisible(false);
              }}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  icon: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 20,
    right: 20,
  },
  profileContainer: {
    backgroundColor: "white",
    width: "90%",
    marginTop: 80,
    marginLeft: 20,
    padding: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  fieldContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  fieldLabel: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  inputField: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    flex: 1,
    height: 50,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
    borderRadius: 5,
    paddingHorizontal: 4,
    height: 50,
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
  allergyFieldContainer: {
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    padding: 5,
  },
  selectedItemText: {
    fontSize: 14,
    color: "#333",
    marginRight: 5,
  },
  selectedText: {
    fontSize: 16,
    color: "#000",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    height: 40,
    width: 250,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    marginTop: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#bbb",
  },
  inputSearchStyle: {
    height: 40,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  iconStyle: {
    fontSize: 18,
    color: "#000",
  },
  item: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    marginRight: 10,
  },
  selectedAllergyText: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
    marginBottom: 5,
  },
  birthdayContainer: {
    flexDirection: "row",
    alignItems: "end",
  },
  iconContainer: {
    marginLeft: 10,
  },
  profileText: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainerDelete: {
    flex: 1,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentDelete: {
    width: "80%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitleDelete: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 1,
  },
  cancelButton: {
    marginTop: 1,
    backgroundColor: "gray",
  },
  signOutButton: {
    marginTop: 5,
    marginBottom: 5,
  },
});
