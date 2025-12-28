import NumpadForm from "@/components/NumpadForm";
import { SpendingTypeToggle } from "@/components/SpendingTypeToggle";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{ marginHorizontal: "auto", gap: 12 }}>
        <SpendingTypeToggle
          onChange={(value) =>
            console.log("[SpendingToggleType]: value", value)
          }
        />
        <NumpadForm
          onValueChange={(value) => console.log("[NumpadForm]: value", value)}
        />
      </View>
    </SafeAreaView>
  );
}
