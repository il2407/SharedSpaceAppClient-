import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function PasswordComponent({
  value,
  onChangeText,
  label,
  icon,
  keyboardType,
}) {
  const [passwordVisible, setPasswordVisible] = useState(true);
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
        secureTextEntry={passwordVisible}
        left={<TextInput.Icon name={icon} />}
        right={
          <TextInput.Icon
            name={passwordVisible ? "eye" : "eye-off"}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
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
