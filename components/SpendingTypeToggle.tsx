import { Text } from "@/components/ui/text";
import { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";

export enum SpendingType {
  EXPENSE = "expense",
  INCOME = "income",
}

type SpendingTypeToggleProps = {
  type: SpendingType;
  setType: React.Dispatch<React.SetStateAction<SpendingType>>;
};

export function SpendingTypeToggle({ type, setType }: SpendingTypeToggleProps) {
  const toggleType = () => {
    const newType =
      type === SpendingType.EXPENSE
        ? SpendingType.INCOME
        : SpendingType.EXPENSE;
    setType(newType);
  };

  return (
    <Pressable
      onPress={toggleType}
      style={{
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <SelectedText selected={type === SpendingType.INCOME}>
          {SpendingType.INCOME}
        </SelectedText>
        <SelectedText selected={type === SpendingType.EXPENSE}>
          {SpendingType.EXPENSE}
        </SelectedText>
      </View>
    </Pressable>
  );
}

function SelectedText({
  children,
  selected,
  ...props
}: PropsWithChildren<{ selected: boolean }>) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 2,
        backgroundColor: selected ? "black" : "white",
        paddingVertical: 4,
      }}
    >
      <Text
        style={{
          textTransform: "capitalize",
          color: selected ? "white" : "black",
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        {children}
      </Text>
    </View>
  );
}
