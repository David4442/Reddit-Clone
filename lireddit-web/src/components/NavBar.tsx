import { useApolloClient } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();

  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  const [clientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    setClientRendered(true);
  }, []);

  let body = <Box>Loading...</Box>;

  if (clientRendered && !loading) {
    if (!data?.me) {
      body = (
        <>
          <NextLink href="/login">
            <Button mr={2} variant="link" color={"black"}>
              Login
            </Button>
          </NextLink>

          <NextLink href="/register">
            <Button variant="link" color={"black"}>
              Register
            </Button>
          </NextLink>
        </>
      );
    } else {
      body = (
        <Flex align={"center"}>
          <NextLink href="/create-post">
            <Button color={"black"} mr={4}>
              Create a Post
            </Button>
          </NextLink>
          <Spacer />
          <Menu>
            <MenuButton as={Button} variant="link" colorScheme="black">
              <Avatar size="sm" name={data.me.username} />
            </MenuButton>
            <MenuList>
              <MenuItem>{data.me.username}</MenuItem>
              <MenuItem
                onClick={async () => {
                  await logout();
                  await apolloClient.resetStore();
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      );
    }
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="slategray" p={4}>
      <Flex flex={1} maxW={800} align={"center"} m="auto">
        <NextLink href="/">
          <Button variant="link" color={"black"} ml="auto">
            <Heading>Home</Heading>
          </Button>
        </NextLink>
        <Spacer />
        {body}
      </Flex>
    </Flex>
  );
};
