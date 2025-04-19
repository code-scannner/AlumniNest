import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import { Icon } from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import Constants from "expo-constants";
import { Image } from "expo-image";
import Loading from "./Loading";
import { router } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const textStyle = {
  color: theme.colors.text,
  fontSize: hp(1.75),
};
const tagStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};
export default function PostCard({
  item,
  user,
  postuser,
  hasShadow = true,
  commentCount,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item?.total_likes);
  const [loading, setLoading] = useState(false);

  const checkIfLiked = async () => {
    try {
      console.log("Checking if liked status....");
      const res = await axios.get(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/post/isliked",
        {
          params: { user_id: user?._id, post_id: item?._id },
        }
      );

      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikeCount(res.data.total_likes);
      }
    } catch (error) {
      console.error("Error checking like status", error);
    }
  };

  useEffect(() => {
    if (!item) return;
    if (!user) return;
    checkIfLiked();
  }, [item, user]);

  const onLike = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (isLiked) {
        const res = await axios.put(
          "http://" + Constants.expoConfig.extra.baseurl + "/api/post/unlike",
          { post_id: item?._id },
          { headers: { token } }
        );

        if (res.data.success) {
          setIsLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      } else {
        const res = await axios.post(
          "http://" + Constants.expoConfig.extra.baseurl + "/api/post/like",
          { post_id: item?._id },
          { headers: { token } }
        );

        if (res.data.success) {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
      console.error("Error liking/unliking post", error);
    }
  };

  const openDetails = () => {
    if (!showMoreIcon) return;
    router.push({
      pathname: "/postDetails",
      params: {
        post_id: item?._id,
        user_id: item?.poster_id,
      },
    });
  };
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={
              postuser?.profile_pic
                ? postuser.profile_pic
                : "https://fra.cloud.appwrite.io/v1/storage/buckets/67f8e53c0001a80cdbde/files/67fecfeb003d718fc6cc/view?project=67f8e5020020502a85c0&mode=admin"
            }
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{postuser?.full_name}</Text>
            <Text style={styles.postTime}>
              {moment(item?.timestamp).format("MMM D")}
            </Text>
          </View>
        </View>

        {showMoreIcon && (
          <TouchableOpacity onPress={() => {}}>
            <Icon
              name={"threeDotsHorizontal"}
              size={hp(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {showDelete && user?._id === postuser?._id && (
          <>
            <View style={styles.actins}>
              <TouchableOpacity
              // onPress={() => {
              //   onEdit(item);
              // }}
              >
                <Icon name={"edit"} size={hp(2.5)} color={theme.colors.text} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onDelete}>
                <Icon
                  name={"delete"}
                  size={hp(2.5)}
                  color={theme.colors.rose}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
          <Text>
            {item?.content && (
              <RenderHtml
                contentWidth={wp(100)}
                source={{ html: item?.content }}
                tagsStyles={tagStyles}
              />
            )}
          </Text>
        </View>

        {item?.image && (
          <>
            <Image
              source={{ uri: `${item.image}` }}
              transition={100}
              style={styles.postMedia}
              contentFit="cover"
            />
          </>
        )}
      </View>

      {
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
              <Icon
                name={"heart"}
                size={24}
                color={!isLiked ? theme.colors.text : theme.colors.rose}
                fill={!isLiked ? "white" : theme.colors.rose}
              />
            </TouchableOpacity>
            <Text style={styles.count}>{likeCount}</Text>
          </View>

          <View style={styles.footerButton}>
            <TouchableOpacity onPress={openDetails}>
              <Icon name={"comment"} size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.count}>
              {commentCount ? commentCount : item?.total_comments}
            </Text>
          </View>

          {/* <View style={styles.footerButton}>
            {loading ? (
              <>
                <Loading size="small" />
              </>
            ) : (
              <>
                <TouchableOpacity>
                  <Icon name={"share"} size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </>
            )}
          </View> */}
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
  actins: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  postBody: {
    marginLeft: 5,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  content: {
    gap: 10,
    color: theme.colors.text,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: "500",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
