import { Button, HStack, Input } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
// import socket from "../../socket";
import { useContext } from "react";
import { MessagesContext, SocketContext } from "./Home";

export const ChatBox = ({ userid }) => {
	const { setMessages } = useContext(MessagesContext);
	const { socket } = useContext(SocketContext);

	return (
		<Formik
			initialValues={{ message: "" }}
			onSubmit={(values, actions) => {
				const messageData = {
					to: userid,
					from: null,
					content: values.message,
				};
				// console.log(messageData);
				socket.emit("message:direct", messageData);
				setMessages((messages) => [messageData, ...messages]);
				actions.resetForm();
			}}
		>
			<HStack as={Form} w="100%" p="0.4rem 1rem 1rem">
				<Input
					as={Field}
					name="message"
					placeholder="Type a message"
					size="lg"
					autoComplete="off"
				/>
				<Button type="submit" size="lg" colorScheme="teal">
					Send
				</Button>
			</HStack>
		</Formik>
	);
};

export default ChatBox;
