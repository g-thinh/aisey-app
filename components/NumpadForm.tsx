/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropsWithChildren, useState } from "react";
import { Pressable, View, Text, PressableProps, ViewStyle } from "react-native";

const GAP = 14;

export default function NumpadForm() {
  const [rawValue, setRawValue] = useState("");

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const handlePress = (num: string) => {
    // 1. PREVENT MULTIPLE LEADING ZEROS
    if (rawValue === "0" && num === "0") return;

    // 2. DECIMAL GUARD: Only one dot allowed
    if (num === "." && rawValue.includes(".")) return;

    // 3. START WITH DECIMAL: If empty and "." is pressed
    if (num === "." && rawValue === "") {
      setRawValue("0.");
      return;
    }

    // 4. REPLACE INITIAL ZERO: If current value is "0"
    if (rawValue === "0" && num !== ".") {
      setRawValue(num);
      return;
    }

    // 5. FRACTION LIMIT: (The Fix)
    // Check if we are adding a digit to an existing decimal part
    if (num !== "." && rawValue.includes(".")) {
      const parts = rawValue.split(".");
      const fraction = parts[1] || ""; // Default to empty string if undefined
      if (fraction.length >= 2) {
        return;
      }
    }

    // 6. LENGTH LIMIT
    if (rawValue.length >= 10) return;

    setRawValue((prev) => prev + num);
  };

  const handleClear = () => {
    setRawValue("");
  };

  const getDisplayValue = () => {
    if (rawValue === "") return formatter.format(0);

    const formatted = formatter.format(parseFloat(rawValue));

    // Logic to "re-attach" zeros that the formatter hides while typing
    if (rawValue.includes(".")) {
      const [_, rawFraction] = rawValue.split(".");
      const [wholePart, _formattedFraction] = formatted.split(".");

      // If the user is typing .0 or .05, manually ensure the zeros show up
      if (rawFraction !== undefined) {
        return `${wholePart}.${rawFraction}`;
      }
    }

    return formatted;
  };

  const handleBackspace = () => {
    setRawValue((prev) => {
      if (prev.length === 0) return "";

      // 1. Create the new string by removing the last character
      let nextValue = prev.slice(0, -1);

      // 2. If the new string now ends with a dot, remove that too
      if (nextValue.endsWith(".")) {
        nextValue = nextValue.slice(0, -1);
      }

      return nextValue;
    });
  };

  const handleEnter = () => {
    const numericValue = parseFloat(rawValue);
    const value = getDisplayValue();

    if (isNaN(numericValue)) {
      alert("Nothing entered");
    } else {
      alert(`Added ${value} - ${numericValue}`);
    }

    handleClear();
  };

  return (
    <View
      style={{
        width: "100%",
        gap: 32,
        backgroundColor: "white",
        alignItems: "center",
        padding: 24,
        borderRadius: 12,
      }}
    >
      <View>
        <Text style={{ fontSize: 48, fontWeight: "500" }}>
          {getDisplayValue()}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: GAP,
          justifyContent: "center",
        }}
      >
        <View style={{ gap: GAP }}>
          <View style={{ flexDirection: "row", gap: GAP }}>
            <NumpadButton onPress={() => handlePress("1")}>1</NumpadButton>
            <NumpadButton onPress={() => handlePress("2")}>2</NumpadButton>
            <NumpadButton onPress={() => handlePress("3")}>3</NumpadButton>
          </View>
          <View style={{ flexDirection: "row", gap: GAP }}>
            <NumpadButton onPress={() => handlePress("4")}>4</NumpadButton>
            <NumpadButton onPress={() => handlePress("5")}>5</NumpadButton>
            <NumpadButton onPress={() => handlePress("6")}>6</NumpadButton>
          </View>
          <View style={{ flexDirection: "row", gap: GAP }}>
            <NumpadButton onPress={() => handlePress("7")}>7</NumpadButton>
            <NumpadButton onPress={() => handlePress("8")}>8</NumpadButton>
            <NumpadButton onPress={() => handlePress("9")}>9</NumpadButton>
          </View>
          <View style={{ flexDirection: "row", gap: GAP }}>
            <NumpadButton onPress={() => handlePress("0")}>0</NumpadButton>
            <NumpadButton onPress={() => handlePress("00")}>00</NumpadButton>
            <NumpadButton onPress={() => handlePress(".")}>.</NumpadButton>
          </View>
        </View>
        <View style={{ gap: GAP }}>
          <NumpadButton
            style={{ backgroundColor: "orange" }}
            onPress={handleBackspace}
          >
            Back
          </NumpadButton>
          <NumpadButton
            style={{ backgroundColor: "orange" }}
            onPress={handleClear}
          >
            Clear
          </NumpadButton>
          <NumpadButton
            style={{ backgroundColor: "orange" }}
            onPress={handleEnter}
          >
            Enter
          </NumpadButton>
        </View>
      </View>
    </View>
  );
}

function NumpadButton({
  children,
  style,
  ...props
}: PropsWithChildren<PressableProps>) {
  return (
    <Pressable
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: "black",
          minWidth: 50,
          minHeight: 50,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        },
        style as ViewStyle,
      ]}
      {...props}
    >
      <Text style={{ color: "white", fontWeight: "600", fontSize: 20 }}>
        {children}
      </Text>
    </Pressable>
  );
}
