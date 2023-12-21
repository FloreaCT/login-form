import Checkbox from "expo-checkbox";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import tw from "twrnc";
import CustomInput from "./components/CustomInput/CustomInput";
import Logo from "./img/logo";

// Defining form data type
export type FormData = {
  email: string;
  password: string;
};

// Validating email based on most common email regex
const emailValidation = {
  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  message: "Please enter a valid email address",
};

const App: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [failedLogin, setFailedLogin] = React.useState<boolean>(false);
  const [successLogin, setSuccessLogin] = React.useState<boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (failedLogin || successLogin) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [successLogin, failedLogin, pulseAnim]);

  const onSubmit = (data: FormData) => {
    if (data.email === "cristian@10zyme.com" && data.password === "123456") {
      // Simulating a login request
      setSuccessLogin(true);
      setTimeout(() => {
        setSuccessLogin(false);
      }, 3000);
    } else {
      setFailedLogin(true);
      setTimeout(() => {
        setFailedLogin(false);
      }, 3000);
    }
  };

  return (
    <TailwindProvider>
      <StatusBar style="auto" />
      <View style={tw`flex-1 items-center justify-center p-14`}>
        <Logo />

        <CustomInput
          name="email"
          control={control}
          rules={{ required: "Email is required", pattern: emailValidation }}
          placeholder={"Email"}
          secureTextEntry={false}
        />

        <CustomInput
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          placeholder={"Password"}
          secureTextEntry={true}
        />
        <View style={tw`flex-row self-stretch items-center mb-2`}>
          <Checkbox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
            color={toggleCheckBox ? "#129A9E" : "#8e918f"}
          />
          <Text style={tw`ml-2`}>Remember Me</Text>
        </View>

        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <View style={tw`bg-[#129A9E] py-2 px-4 rounded`}>
            <Text style={tw`text-white text-center`}>Login</Text>
          </View>
        </TouchableOpacity>
        <View>
          {failedLogin && (
            <Animated.Text
              style={{ opacity: pulseAnim, color: "red", marginTop: 10 }}
            >
              We couldn't find any user with that email and password
              combination.
            </Animated.Text>
          )}
          {successLogin && (
            <Animated.Text
              style={{ opacity: pulseAnim, color: "green", marginTop: 10 }}
            >
              Login successful!
            </Animated.Text>
          )}
        </View>
      </View>
    </TailwindProvider>
  );
};

export default App;
