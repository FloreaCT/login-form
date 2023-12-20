import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, TextInput, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import tw from "twrnc";
import Logo from "./img/logo";

type FormData = {
  username: string;
  password: string;
};

const App: React.FC = () => {
  return (
    <TailwindProvider>
      <StatusBar style="auto" />
      <View style={tw`flex-1 items-center justify-center`}>
        <View>
          <Logo />
        </View>
        <View>
          <TextInput placeholder="Username" />
          <TextInput placeholder="Password" />
        </View>
        <Button title="Login" />
      </View>
    </TailwindProvider>
  );
};

export default App;
