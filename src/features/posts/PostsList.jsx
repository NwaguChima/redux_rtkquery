import React from "react";
import { useSelector } from "react-redux";
import { selectPostIds, getPostsStatus, getPostsError } from "./postsSlice";
import PostsExcerpts from "./PostsExcerpts";
import { useGetPostsQuery } from "./postsSlice";

const PostsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const orderedPostIds = useSelector(selectPostIds);
  const postsStatus = useSelector(getPostsStatus);

  // For page rendering
  let content;
  if (postsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postsStatus === "succeeded") {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpts key={postId} postId={postId} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};

export default PostsList;
