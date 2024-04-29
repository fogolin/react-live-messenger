import { TabPanel, TabPanels, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { FriendContext } from "./Home";

export const Chat = () => {
	const { friendList } = useContext(FriendContext);

	return (
		<VStack>
			{friendList.length > 0 ? (
				<TabPanels>
					<TabPanel>Friend One</TabPanel>
					<TabPanel>Friend Two</TabPanel>
				</TabPanels>
			) : (
				<TabPanels>
					<TabPanel>
						<Text>No chats yet</Text>
					</TabPanel>
				</TabPanels>
			)}
		</VStack>
	);
};

export default Chat;
