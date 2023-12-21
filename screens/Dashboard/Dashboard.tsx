import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";
import tw from "twrnc";
import { RootStackParamList } from "../../navigation/types";
import { FormData } from "../Login/Login";

interface DashboardScreenProps {
  data: FormData;
}

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const [userName, setUserName] = React.useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute();

  useEffect(() => {
    // Checking if the user was redirected from the login screen
    if ((route.params as { user: string })?.user) {
      const userData = JSON.parse(
        (route.params as { user: string })?.user ?? ""
      );
      setUserName(userData.email);
    } else {
      const getUserSession = async () => {
        try {
          const userSession = await SecureStore.getItemAsync("user_session");
          if (userSession) {
            const userData = JSON.parse(userSession);
            setUserName(userData.email);
          }
        } catch (error) {
          console.log(
            "There was an error while retrieving the user session",
            error
          );
        }
      };
      getUserSession();
    }
  }, [route.params]);

  const onLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("user_session");
      navigation.navigate("Login");
    } catch (error) {
      console.log("There was an error while deleting the user session");
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-xl mb-4`}>Welcome, {userName}!</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

export default DashboardScreen;
