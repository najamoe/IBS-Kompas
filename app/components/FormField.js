import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showpassword, setShowpassword] = useState(false);

  return (
    <View>
      <Text>{title}</Text>

      <View style={styles.form}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="grey"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showpassword}
          style={styles.input} // Add style to TextInput
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowpassword(!showpassword)}>
            <FontAwesome
              name={!showpassword ? "eye" : "eye-slash"}
              size={20}
              color="black"
              style={styles.eyeIcon} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  form: {
    width: '90%',
    backgroundColor: "white",
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 10, 
    borderWidth: 1,
    borderColor: "grey", 
    borderRadius: 5, 
    marginTop: 10,
    marginBottom: 10,
    
  },
  input: {
    flex: 1, 
    padding: 8, 
    fontSize:16,
  },
  eyeIcon: {
    marginLeft: 10, 
    
  },
});
