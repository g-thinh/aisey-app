import { Text, View } from "react-native";

type HeaderProps = {
  title: string;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
};

export default function Header({
  title,
  headerLeft,
  headerRight,
}: HeaderProps) {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 20,
        minHeight: 60,
      }}
    >
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        {headerLeft && headerLeft}
      </View>
      <View style={{ flex: 2, alignItems: "center" }}>
        <Text style={{ fontWeight: "600", fontSize: 24, textAlign: "center" }}>
          {title}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: "flex-end" }}>
        {headerRight && headerRight}
      </View>
    </View>
  );
}
