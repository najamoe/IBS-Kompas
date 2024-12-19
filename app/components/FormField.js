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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          style={styles.input}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowpassword(!showpassword)}>
            <FontAwesome
              name={!showpassword ? "eye" : "eye-slash"}
              size={16}
              color="black"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
        
        {title === "Confirm Password" && (
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome
              name={!showConfirmPassword ? "eye" : "eye-slash"}
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
    width: "90%",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "white",  // Change this to 'white' or any color you prefer
    paddingHorizontal: 10,
    borderRadius: 40,
    height: 40,  
    
    marginTop: 2,
    marginLeft: 4,
    marginBottom: 2,
  },
  eyeIcon: {
    marginLEft: 2,
  },
});
