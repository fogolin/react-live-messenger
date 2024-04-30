import {
	Button,
	Circle,
	Divider,
	HStack,
	Heading,
	Tab,
	TabList,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { FriendContext } from "./Home";
import AddFriendModal from "./AddFriendModal";

export const Sidebar = () => {
	const { friendList } = useContext(FriendContext);
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<VStack py="1.4rem">
				<HStack justify="space-evenly" width="100%">
					<Heading size="md">Add Friend</Heading>
					<Button onClick={onOpen}>
						<ChatIcon />
					</Button>
				</HStack>
				<Divider />
				<VStack as={TabList}>
					{friendList.map((friend) => (
						<>
							<HStack as={Tab} key={friend.userid}>
								<Circle
									bg={friend.connected ? "green.700" : "red.500"}
									w="12px"
									h="12px"
								/>
								<Text>{friend.username}</Text>
							</HStack>
						</>
					))}
				</VStack>
			</VStack>
			<AddFriendModal isOpen={isOpen} onClose={onClose} />
		</>
	);
};

export default Sidebar;
