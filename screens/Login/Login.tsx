import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Checkbox from "expo-checkbox";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import tw from "twrnc";
import CustomInput from "../../components/CustomInput/CustomInput";
import Logo from "../../components/Logo/logo";
import { RootStackParamList } from "../../navigation/types";

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

const Login: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [failedLogin, setFailedLogin] = React.useState<boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = React.useState<boolean>(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // Checking if there is a user session stored in the device
  // In production this would push the user to the dashboard
  useEffect(() => {
    const getUserSession = async () => {
      try {
        const userSession = await SecureStore.getItemAsync("user_session");
        if (userSession) {
          navigation.navigate("Dashboard" as never);
        }
      } catch (error) {
        console.log("There was an error while retrieving the user session");
      }
    };
    getUserSession();
  }, []);

  // Animating the error message
  useEffect(() => {
    if (failedLogin) {
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
  }, [failedLogin, pulseAnim]);

  const onSubmit = async (data: FormData) => {
    // Simulating data fetching from an API
    if (data.email === "cristian@10zyme.com" && data.password === "123456") {
      // Storing user session in the device
      if (toggleCheckBox) {
        try {
          await SecureStore.setItemAsync("user_session", JSON.stringify(data));
        } catch (error) {
          console.log("There was an error while storing the user session");
          return;
        }
      } else {
        // Simulating data store in App State (Redux, Context, etc.)
        reset();
        navigation.navigate("Dashboard", { user: JSON.stringify(data) });
      }
      reset();
      navigation.navigate("Dashboard" as never);
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
          rules={{
            required: "Email is required",
            pattern: emailValidation,
          }}
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

        <TouchableOpacity
          style={tw`flex-row self-stretch items-center mb-2`}
          onPress={() => setToggleCheckBox(!toggleCheckBox)}
          activeOpacity={0.7}
        >
          <View style={tw`flex-row self-stretch items-center mb-2`}>
            <Checkbox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
              color={toggleCheckBox ? "#129A9E" : "#8e918f"}
            />
            <Text style={tw`ml-2`}>Remember Me</Text>
          </View>
        </TouchableOpacity>
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
        </View>
      </View>
    </TailwindProvider>
  );
};

export default Login;
