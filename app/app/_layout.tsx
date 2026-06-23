import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/expo";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <Stack />
    </ClerkProvider>
  );
}
