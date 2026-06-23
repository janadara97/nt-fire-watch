import MapView from "../components/MapView.web";
import {
  Show
} from "@clerk/expo";
import { SignInButton, UserButton, UserAvatar } from "@clerk/expo/web";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Show when="signed-out">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Please sign in to continue</Text>
          <SignInButton mode="modal" />
        </View>
      </Show>
      <Show when="signed-in">
        <View style={{ flex: 1 }}>
          <View style={{ padding: 10, alignItems: "flex-end" }}>
            <UserButton />
          </View>
          <MapView />
        </View>
      </Show>
    </View>
  );
}