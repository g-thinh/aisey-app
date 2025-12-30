import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import useEntries from "@/hooks/useEntries";
import { formatCurrency } from "@/utils/formatCurrency";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EntriesScreen() {
  const { getEntries } = useEntries();

  if (getEntries.isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Entries"
        headerLeft={<BackButton />}
        headerRight={
          <Pressable
            onPress={() => alert("implement filters")}
            style={{
              borderWidth: 1,
              padding: 8,
              borderRadius: 12,
              backgroundColor: "black",
            }}
          >
            <Feather name="filter" size={16} color="white" />
          </Pressable>
        }
      />
      {/* TODO: When filters are active display them as pills here */}
      {/* <View
        style={{
          marginHorizontal: 20,
          marginBottom: 12,
          flexDirection: "row",
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => alert("implement sort here")}
          style={{
            backgroundColor: "lightgrey",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 14,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Sort</Text>
        </Pressable>
        <Pressable
          onPress={() => alert("implement range here")}
          style={{
            backgroundColor: "lightgrey",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 14,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Date Range</Text>
        </Pressable>
      </View> */}
      <ScrollView
        style={{
          marginHorizontal: 20,
          padding: 16,
          backgroundColor: "white",
          borderRadius: 8,
          gap: 14,
          marginBottom: 32,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            minHeight: 50,
            borderColor: "lightgrey",
          }}
        >
          <Text
            style={{
              width: "25%",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Amount
          </Text>
          <Text
            style={{
              width: "25%",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Type
          </Text>
          <Text
            style={{
              width: "25%",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Date
          </Text>
          <Text
            style={{
              width: "25%",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            By
          </Text>
        </View>
        {getEntries.data?.map(({ entries, users }, index) => (
          <View
            key={entries.id}
            style={{
              borderBottomWidth: getEntries.data.length === index + 1 ? 0 : 1,
              minHeight: 50,
              borderColor: "lightgrey",
            }}
          >
            <View style={{ flexDirection: "row", paddingVertical: 12 }}>
              <Text
                style={{
                  flex: 1,
                  width: "25%",
                  textAlign: "center",
                }}
              >
                {formatCurrency.format(entries.amount)}
              </Text>
              <Text
                style={{
                  width: "25%",
                  textAlign: "center",
                  textTransform: "capitalize",
                  color: entries.type === "expense" ? "red" : "green",
                }}
              >
                {entries.type}
              </Text>
              <Text
                style={{
                  flex: 1,
                  width: "25%",
                  textAlign: "center",
                }}
              >
                {entries.posted_at.toLocaleDateString()}
              </Text>
              <Text
                style={{
                  flex: 1,
                  width: "25%",
                  textAlign: "center",
                }}
              >
                {users?.name}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
