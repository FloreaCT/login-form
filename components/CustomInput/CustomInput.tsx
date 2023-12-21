import React, { useRef } from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import { FormData } from "../../App";

// Defining data type for the custom inputs
interface CustomInputProps {
  name: keyof FormData;
  control: Control<FormData>;
  rules: RegisterOptions;
  placeholder: string;
  secureTextEntry: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  control,
  name,
  rules,
  placeholder,
  secureTextEntry,
}) => {
  // Creating a reference for the input to focus on it when the user clicks anywhere on the input field
  const inputRef = useRef<TextInput>(null);
  // Defining icon properties
  const iconName = name === "email" ? "envelope" : "lock";
  const iconSize = 20;
  const iconColor = "gray";

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <TouchableOpacity
            style={tw`w-full`}
            onPress={() => inputRef.current?.focus()}
            activeOpacity={0.7}
          >
            <View
              style={tw`flex flex-row border p-2 rounded w-full mb-2 ${
                error ? "border-red-300" : "border-gray-300"
              } `}
            >
              <Icon
                name={iconName}
                size={iconSize}
                color={iconColor}
                style={tw`mr-2 mt-1`}
              />
              <TextInput
                ref={inputRef}
                placeholder={placeholder}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                secureTextEntry={secureTextEntry}
              />
            </View>
          </TouchableOpacity>
          {error && (
            <Text style={tw`self-stretch text-red-500 mb-2 `}>
              {error?.message || ""}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default CustomInput;
