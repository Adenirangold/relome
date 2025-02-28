import { Card, FeaturedCard } from "@/components/Card";
import Filters from "@/components/Filters";
import Noresult from "@/components/Noresult";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    loading: propertiesLoading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      query: params.query,
      filter: params.filter,
      limit: 20,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter,
      query: params.query,
      limit: 20,
    });
  }, [params.query, params.filter]);

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };
  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={properties}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          propertiesLoading ? (
            <ActivityIndicator
              className="text-primary-300"
              size="large"
            ></ActivityIndicator>
          ) : (
            <Noresult></Noresult>
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5"></Image>
              </TouchableOpacity>
              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search For Your Ideal Home
              </Text>

              <Image source={icons.bell} className="w-6 h-6 "></Image>
            </View>
            <Search></Search>
            <View className="mt-5">
              <Filters></Filters>
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {properties?.length} Properties
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)}></Card>
        )}
      ></FlatList>
    </SafeAreaView>
  );
}
