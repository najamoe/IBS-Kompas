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
import BowelModal from "../modal/bowelModal";
import { subscribeBowelLog } from "../../services/firebase/bowelService";

const BowelDisplay = ({ user, selectedDate }) => {
  const [isBowelModalVisible, setIsBowelModalVisible] = useState(false);
  const [bowelStep, setBowelStep] = useState(1);
  const [bowelLogs, setBowelLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  // Fetch bowel logs on component mount or when `user` or `selectedDate` changes
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
                {/* Inserting time from firestore*/}
                <Text style={styles.timeStamp}>  {log.timestamp}</Text>
              </View>
            ))
          ) : (
            <Text>Ingen toiletbesøg idag.</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            setIsBowelModalVisible(true);
            setBowelStep(1);
          }}
          style={styles.addBowelButton}
        >
          <Text style={styles.addBowelText}>Tilføj</Text>
        </TouchableOpacity>
      </View>

      {/* Bowel Modal */}
      <BowelModal
        isVisible={isBowelModalVisible}
        onClose={() => setIsBowelModalVisible(false)}
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
    backgroundColor: "grey",
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
    color: "black"
  }
});
