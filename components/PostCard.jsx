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
import { Image } from "expo-image";
import { Video } from "expo-av";
import Loading from "./Loading";
import { router } from "expo-router";

const textStyle = {
  color: theme.colors.dark,
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
  hasShadow = true,
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
  const [likes, setLikes] = useState(item?.likesBy || []);
  const [loading, setLoading] = useState(false);

  const checkIfLiked = async () => {
    try {
        let res = await fetch(`/api/likes/isLiked?user_id=${currentUser?.id}&post_id=${item?.id}`);
        let data = await res.json();
        if (data.success) {
            setIsLiked(data.isLiked);
        }
    } catch (error) {
        console.error("Error checking like status", error);
    }
};

useEffect(() => {
    checkIfLiked();
}, [item]); 

const onLike = async () => {
  try {
      if (isLiked) {
          let res = await fetch("/api/likes/unlike", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: currentUser?.id, post_id: item?.id }),
          });
          let data = await res.json();
          if (data.success) {
              setIsLiked(false);
              setLikeCount(likeCount - 1);
          }
      } else {
          let res = await fetch("/api/likes/like", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: currentUser?.id, post_id: item?.id }),
          });
          let data = await res.json();
          if (data.success) {
              setIsLiked(true);
              setLikeCount(likeCount + 1);
          }
      }
  } catch (error) {
      console.error("Error liking/unliking post", error);
  }
};

  // const onLike = async () => {
  //   //     if (isLikedByMe) {
  //   //       let res = await removePostLike(item?.id, currentUser?.id);
  //   //       if (res.success) {
  //   //         setLikes([...likes.filter((l) => l.userId !== currentUser?.id)]);
  //   //       } else {
  //   //         Alert.alert("Post", "something went wrong2");
  //   //       }
  //   //     } else {
  //   //       let data = {
  //   //         userId: currentUser?.id,
  //   //         postId: item?.id
  //   //       };
  //   //       let res = await createPostLike(data);
  //   //       console.log({ res });
  //   //       if (!res.success) {
  //   //         Alert.alert("Post", "something went wrong");
  //   //       } else {
  //   //         setLikes([...likes, data]);
  //   //       }
  //   //     }
  //   //   };
  //   //   const isLikedByMe = likes.find(
  //   //     (likeData) => likeData?.userId === currentUser?.id
  //   //   );
  //   //   const onShare = async () => {
  //   //     console.log("abc");
  //   //     let content = { message: item?.body?.replace(/<\/?[^>]+(>|$)/g, "") };
  //   //     console.log({ item });
  //   //     if (item?.file) {
  //   //       setLoading(true);
  //   //       console.log("hello...");
  //   //       const fileURL = await getSupabaseFileUrl(item?.file);
  //   //       console.log({ fileURL });
  //   //       let url = await downloadFile(getSupabaseFileUrl(item?.file));
  //   //       content.url = url;
  //   //       setLoading(false);
  //   //     }
  //   //     Share.share(content);
  //   //   };
  //   //   const openDetails = () => {
  //   //     if (!showMoreIcon) return;
  //   //     router.push({
  //   //       pathname: "/postDetails",
  //   //       params: {
  //   //         postId: item?.id
  //   //       }
  //   //     });
  //   //   };
  //   //   const handlePostDelete = async () => {
  //   //     Alert.alert("Confirm", "Are you sure want to do this!", [
  //   //       {
  //   //         text: "Cancel",
  //   //         onPress: () => console.log("Cancel Pressed"),
  //   //         style: "cancel"
  //   //       },
  //   //       {
  //   //         text: "delete",
  //   //         onPress: async () => await onDelete(item),
  //   //         style: "destructive"
  //   //       }
  //   //     ]);
  // };
  if (!item) return null;
  console.log(item);

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={
              user?.image
                ? user.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjDGMp734S91sDuUFqL51_xRTXS15iiRoHew&s"
            }
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{user?.full_name}</Text>
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

        {showDelete && user?.id === item?.poster_id && (
          <>
            <View style={styles.actins}>
              <TouchableOpacity
                onPress={() => {
                  onEdit(item);
                }}
              >
                <Icon name={"edit"} size={hp(2.5)} color={theme.colors.text} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePostDelete}>
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
            <TouchableOpacity
            // onPress={onLike}
            >
              <Icon
                name={"heart"}
                size={24}
                color={false ? theme.colors.text : theme.colors.rose}
                fill={false ? "white" : theme.colors.rose}
              />
            </TouchableOpacity>
            <Text style={styles.count}>{likes?.length}</Text>
          </View>

          <View style={styles.footerButton}>
            <TouchableOpacity
            // onPress={openDetails}
            >
              <Icon name={"comment"} size={24} color={theme.colors.text} />
            </TouchableOpacity>
            {/* <Text style={styles.count}>{item?.comments[0]?.count || 0}</Text> */}
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
