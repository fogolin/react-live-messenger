import { TabPanel, TabPanels, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { FriendContext, MessagesContext } from "./Home";
import ChatBox from "./ChatBox";

export const Chat = ({ userid }) => {
	const { friendList } = useContext(FriendContext);
	const { messages } = useContext(MessagesContext);
	const bottomDiv = useRef(null);

	useEffect(() => {
		bottomDiv.current?.scrollIntoView();
	});

	return (
		<VStack h="100%" justify="end">
			{friendList.length > 0 ? (
				<>
					<TabPanels overflowY="auto">
						{friendList.map((friend) => (
							<VStack
								flexDir="column-reverse"
								as={TabPanel}
								key={friend.userid}
								w="100%"
							>
								<div ref={bottomDiv} />
								{messages
									.filter(
										(message) =>
											message.to === friend.userid ||
											message.from === friend.userid
									)
									.map((filteredMessage, index) => (
										<Text
											key={index}
											bg={
												filteredMessage.to === friend.userid
													? "blue.100"
													: "gray.100"
											}
											color="gray.800"
											borderRadius="10px"
											p="0.5rem 1rem"
											m={
												filteredMessage.to === friend.userid
													? "0.3rem 0 0 auto !important"
													: "0.3rem auto 0 0 !important"
											}
										>
											{filteredMessage.content}
										</Text>
									))}
							</VStack>
						))}
					</TabPanels>
					<ChatBox userid={userid} />
				</>
			) : (
				<TabPanels>
					<Text>No chats yet</Text>
				</TabPanels>
			)}
		</VStack>
	);
};

export default Chat;
