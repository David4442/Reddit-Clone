import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";

import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();

  if (meData?.me?.id !== creatorId) {
    return null;
  }
  return (
    <Box ml={"auto"}>
      <NextLink href={"/post/edit/[id]"} as={`/post/edit/${id}`}>
        <IconButton
          mr={4}
          aria-label={"Edit post"}
          icon={<EditIcon />}
        ></IconButton>
      </NextLink>

      <IconButton
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
        aria-label={"Delete post"}
        icon={<DeleteIcon />}
      ></IconButton>
    </Box>
  );
};
