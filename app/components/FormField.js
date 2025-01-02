import { StyleSheet, Text, View, TextInput } from "react-native";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordField = title === "Password";
  const isConfirmPasswordField = title === "Verificér Password";

  return (
    <View>
      

      <View style={styles.form}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="grey"
          onChangeText={handleChangeText}
          secureTextEntry={
            (isPasswordField && !showPassword) ||
            (isConfirmPasswordField && !showConfirmPassword)
          }
          style={styles.input}
          {...props}
        />

        {isPasswordField && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome
              name={!showPassword ? "eye" : "eye-slash"}
              size={16}
              color="black"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}

        {isConfirmPasswordField && (
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome
              name={!showConfirmPassword ? "eye" : "eye-slash"}
              size={16}
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
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    
    height: 40,
    marginLeft: 10,
   
  },
  eyeIcon: {
    marginLeft: 10,
  },
});
