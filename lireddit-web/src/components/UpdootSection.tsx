import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  VoteMutation,
  useVoteMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";
import { gql } from "urql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  const toast = useToast();

  const handleVote = async (value: number) => {
    try {
      setLoadingState(value === 1 ? "updoot-loading" : "downdoot-loading");
      await vote({
        variables: {
          postId: post.id,
          value,
        },
        update: (cache) => updateAfterVote(value, post.id, cache),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoadingState("not-loading");
    }
  };

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        onClick={() => {
          if (post.voteStatus === 1) {
            return;
          }
          handleVote(1);
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "updoot-loading"}
        icon={<ChevronUpIcon boxSize="6" />}
        aria-label="upvote"
      />
      {post.points}
      <IconButton
        onClick={() => {
          if (post.voteStatus === -1) {
            return;
          }
          handleVote(-1);
        }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downdoot-loading"}
        icon={<ChevronDownIcon boxSize="6" />}
        aria-label="downvote"
      />
    </Flex>
  );
};
