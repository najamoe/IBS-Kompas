import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../components/CustomButton";
import BowelModal from "../modal/bowelModal";
import ConfirmDeleteModal from "../modal/confirmDeleteModal";
import {
  subscribeBowelLog,
  deleteBowelLog,
} from "../../services/firebase/bowelService";

const BowelDisplay = ({ user, selectedDate }) => {
  const [isBowelModalVisible, setIsBowelModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [bowelLogs, setBowelLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const fetchRealTimeData = async () => {
      setLoading(true);
      try {
        unsubscribe = subscribeBowelLog(user.uid, selectedDate, (data) => {
          setBowelLogs(data || []);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error subscribing to bowel log:", error);
        setLoading(false);
      }
    };

    if (user && selectedDate) {
      fetchRealTimeData();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, selectedDate]);

  const handleDeleteLog = (logId) => {
    setSelectedLogId(logId); // Set the selected log ID
    setIsConfirmDeleteVisible(true);
  };

  const confirmDelete = (logId) => {
    if (user && user.uid) {
      deleteBowelLog(user.uid, logId); // Pass both userId and logId (date)
    } else {
      console.error("User ID is missing!");
      Alert.alert("Fejl", "Der opstod en fejl- prøv igen senere.");
    }
    setIsConfirmDeleteVisible(false);
  };


  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} />}
    >
      {/* Bowel Container */}
      <View style={styles.bowelContainer}>
        <View style={styles.logTitleContainer}>
          <Text style={styles.logTitle}>Log toiletbesøg</Text>
        </View>

        <View style={styles.bowelContent}>
          {loading ? (
            <Text>Loading...</Text>
          ) : bowelLogs.length > 0 ? (
            bowelLogs.map((log) => (
              <View key={log.id} style={styles.bowelLogItem}>
                <TouchableOpacity onPress={() => handleDeleteLog(log.id)}>
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={20}
                    color="black"
                    style={styles.trashIcon}
                  />
                </TouchableOpacity>

                <MaterialCommunityIcons
                  name="emoticon-poop"
                  size={30}
                  color="#8c4c1f"
                  style={styles.bowelIcon}
                />
                <Text style={styles.timeStamp}>Kl: {log.timestamp}</Text>
              </View>
            ))
          ) : (
            <Text>Ingen toiletbesøg idag.</Text>
          )}
        </View>

        <CustomButton
          title={"Tilføj"}
          handlePress={() => {
            setIsBowelModalVisible(true);
          }}
          style={styles.addBowelButton}
        />
      </View>

      {/* Bowel Modal */}
      <BowelModal
        isVisible={isBowelModalVisible}
        onClose={() => setIsBowelModalVisible(false)}
      />

      {/* Confirmation Delete Modal */}
      <ConfirmDeleteModal
        isVisible={isConfirmDeleteVisible}
        onConfirm={() => confirmDelete(selectedLogId)}
        onCancel={() => setIsConfirmDeleteVisible(false)}
      />
    </ScrollView>
  );
};

export default BowelDisplay;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  bowelContainer: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
    elevation: 10,
  },
  logTitleContainer: {
    marginBottom: 10,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bowelContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bowelLogItem: {
    position: "relative",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 10,
    width: "30%",
  },
  trashIcon: {
    left: 30,
    padding: 5,
  },
  bowelIcon: {
    marginTop: 6,
  },
  addBowelButton: {
    borderColor: "black",
    borderWidth: 0.2,
    padding: 10,
    borderRadius: 50,
    width: 120,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#d1e7dd",
  },
  addBowelText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  timeStamp: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    color: "black",
  },
});
