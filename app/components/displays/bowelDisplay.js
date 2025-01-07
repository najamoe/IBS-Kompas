import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
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
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false); // State for delete confirmation
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

    if (user) {
      fetchRealTimeData();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, selectedDate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  // Handle delete log action
  const handleDeleteLog = (logId) => {
    setIsConfirmDeleteVisible(true);
  };

  const confirmDelete = (logId) => {
    deleteBowelLog(logId); // Pass the logId to delete the specific log
    setIsConfirmDeleteVisible(false); // Close the confirmation modal
  };

  const cancelDelete = () => {
    setIsConfirmDeleteVisible(false); // Close the confirmation modal without deleting
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
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
                <MaterialCommunityIcons
                  name="emoticon-poop"
                  size={30}
                  color="#8c4c1f"
                />
                <Text style={styles.timeStamp}>Kl: {log.timestamp}</Text>
                {/* Add delete button */}
                <TouchableOpacity onPress={() => handleDeleteLog(log.id)}>
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={20}
                    color="red"
                  />
                </TouchableOpacity>
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
            setBowelStep(1);
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
        onConfirm={() => confirmDelete()}
        onCancel={cancelDelete}
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
    margin: 6,
    alignItems: "center",
    backgroundColor: "#CAE9F5",
    borderRadius: 10,
    padding: 10,
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
    fontSize: 16,
    color: "black",
  },
});
