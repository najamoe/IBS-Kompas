import { useState, useEffect } from "react";


const WaterList = () => {
  const [waterEntries, setWaterEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWaterIntake();
        setWaterEntries(data);
      } catch (error) {
        console.error("Error fetching water intake:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <FlatList
      data={waterEntries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.amount} ml</Text>
          <Text>{new Date(item.date).toLocaleString()}</Text>
        </View>
      )}
    />
  );
};
