import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  Button,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import { getAuth } from "firebase/auth";

import DateTimePicker from "@react-native-community/datetimepicker";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Icon from "react-native-vector-icons/FontAwesome";
import { signOutUser, deleteUserAccount } from "../firebase/auth";
import CustomButton from "../components/CustomButton";
import firebaseConfig from "../firebase/FirebaseConfig";
import {
  fetchUserDetails,
  updateUserDetails,
} from "../services/firebase/userService";
import UpdatePasswordModal from "../components/modal/updatePasswordModal";
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
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      const auth = getAuth();
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
      // Update field based on `editingField`
      await updateUserDetails(user.uid, { [editingField]: editedValue });

      // Update userData state
      setUserData((prevData) => ({
        ...prevData,
        [editingField]: editedValue,
      }));
      Alert.alert("Success", "Dine oplysninger er blevet opdateret");
      setEditingField(null);
      setEditedValue("");
    } catch (error) {
      console.error(`Error updating ${editingField}:`, error);
    }
  };

  const handleFieldEdit = (field) => {
    setEditingField(field);
    setEditedValue(userData[field] || ""); // Preloading the field value if it exists otherwise its set to an empty string
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
      Alert.alert("Success", "Din fødselsdato er blevet opdateret");
    } catch (error) {
      console.error("Error updating birthday in Firestore:", error);
    }
  };

  const handleDeleteUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No authenticated user.");
      return;
    }
    setLoading(true);
    try {
      await deleteUserAccount();
      setLoading(false);
      setModalVisible(false);
      Alert.alert("Konto slettet", "Din konto er slettet");
    } catch (error) {
      console.error("Something went wrong with account deletion", error);
      Alert.alert("Fejl", "Der opstod en fejl under sletning af kontoen.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={styles.profileHeader}>PROFIL</Text>
        <View style={styles.profileContainer}>
          <Text style={styles.fieldLabel}>Navn</Text>
          <View style={styles.fieldContainer}>
            {editingField === "name" ? (
              <TextInput
                style={styles.inputField}
                value={editedValue}
                onChangeText={setEditedValue}
                placeholder="Navn"
              />
            ) : (
              <Text style={styles.profileText}>
                {userData?.name || "Ikke indtastet"}
              </Text>
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
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.fieldContainer}>
            {editingField === "email" ? (
              <TextInput
                style={styles.inputField}
                value={editedValue}
                onChangeText={setEditedValue}
                placeholder="Email"
              />
            ) : (
              <Text style={styles.profileText}>
                {userData?.email || "Ikke indtastet"}
              </Text>
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
          <Text style={styles.fieldLabel}>Køn</Text>
          <View style={styles.fieldContainer}>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                value={gender}
                useNativeAndroidPickerStyle={false}
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
                style={pickerSelectStyles}
                placeholder={{
                  label: "Vælg køn",
                  value: null,
                }}
              />
            </View>
          </View>
          <Text style={styles.fieldLabel}>Fødselsdato</Text>
          <View style={styles.fieldContainer}>
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

          <Text style={styles.fieldLabel}>
            Kendte allergier & intolerancer:
          </Text>
          <View style={styles.allergyFieldContainer}>
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
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
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

          <Text style={styles.fieldLabel}>IBS Type</Text>
          <View style={styles.fieldContainer}>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                value={ibsType}
                useNativeAndroidPickerStyle={false}
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
                style={pickerSelectStyles}
                placeholder={{
                  label: "Vælg IBS Type",
                  value: null,
                }}
              />
            </View>
          </View>
          <Text style={styles.fieldLabel}>Dagligt Vandmål (liter)</Text>
          <View style={styles.fieldContainer}>
            {editingField === "waterGoal" ? (
              <TextInput
                style={styles.inputField}
                value={editedValue}
                onChangeText={setEditedValue}
                keyboardType="numeric"
                placeholder="Dagligt mål i liter"
              />
            ) : (
              <Text style={styles.waterText}>
                {userData?.waterGoal || "Ikke indtastet"}
              </Text>
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

          <View style={styles.buttonContainer}>
            <CustomButton
              title={loading ? "Logger ud..." : "Log ud"}
              customStyles={[
                styles.buttonStyle,
                { backgroundColor: "#86C5D8" },
              ]}
              handlePress={() => {
                signOutUser();
              }}
            />

            <CustomButton
              title={ "Skift password"}
              customStyles={[
                styles.buttonStyle,
                { backgroundColor: "#AFDCEB", zIndeks: 1 },
              ]}
              textStyles={styles.buttonTextStyle}
              handlePress={() => {
                setIsUpdateModalVisible(true);
              }}
            />

            <CustomButton
              title={"Slet konto"}
              customStyles={[
                styles.buttonStyle,
                { backgroundColor: "#a60202" },
              ]}
              handlePress={() => {
                setModalVisible(true);
              }}
              iconName="trash"
            />
          </View>
        </View>
      </ScrollView>

      {isUpdateModalVisible && (
        <UpdatePasswordModal
          visible={isUpdateModalVisible}
          closeModal={() => setIsUpdateModalVisible(false)}
          user={auth.currentUser}
        />
      )}

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
            <View style={styles.deleteButtonContainer}>
              <CustomButton
                title="Nej, slet ikke min konto"
                textStyles={styles.buttonTextStyle}
                handlePress={() => {
                  setModalVisible(false);
                }}
                customStyles={styles.cancelButton}
              />
              <CustomButton
                title={ loading ? "Sletter konto " : "Ja, slet konto"}
                handlePress={handleDeleteUser}
                customStyles={styles.deleteButton}
                textStyles={styles.buttonTextStyle}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#cae9f5",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 20,
    elevation: 10,
  },
  profileHeader: {
    fontSize: 26,
    fontWeight: 600,
    marginTop: 40,
    marginLeft: 20,
    color: "white",
  },
  profileContainer: {
    backgroundColor: "white",
    width: "95%",
    marginTop: 20,
    marginLeft: 10,
    padding: 30,
    borderRadius: 30,
  },
  fieldContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 35,
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    marginBottom: 5,
    marginLeft: 10,
  },
  inputField: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  pickerContainer: {
    width: 260,
    borderRadius: 40,
  },
  placeholderText: {
    color: "#888",
    fontSize: 10,
  },
  allergyFieldContainer: {
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "space-between",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 5,
    borderColor: "black",
    borderWidth: "1",
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
    marginTop: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "black",
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
  iconContainer: {
    marginLeft: 10,
    padding: 5,
  },
  waterText: {
    marginLeft: 120,
    fontSize: 18,
    fontWeight: 500,
  },
  profileText: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  modalContainerDelete: {
    flex: 1,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
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
  buttonContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    width: 200,
    height: 40,
    marginTop: 2,
    marginBottom: 6,
  },
  deleteButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "grey",
    width: 120,
    margin: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    marginTop: 10,
    height: 40,
    width: 110,
  },
  buttonTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
    height: 35,
  },
});
