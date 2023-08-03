import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function CustomTextInput({
  value,
  onChangeText,
  label,
  icon,
  keyboardType,
  secureText = false,
}) {
  return (
    <View>
      <TextInput
        theme={{ roundness: 5 }}
        style={styles.container}
        value={value}
        selectionColor="#FF5733"
        activeOutlineColor="#FF5733"
        outlineColor="#C0C0C0"
        label={label}
        keyboardType={keyboardType}
        mode="outlined"
        onChangeText={onChangeText}
        secureTextEntry={secureText}
        left={icon && <TextInput.Icon name={icon} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
