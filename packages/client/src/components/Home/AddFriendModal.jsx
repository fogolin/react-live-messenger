import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import TextField from "../TextField";
import { Form, Formik } from "formik";
// import socket from "../../socket";
import { useCallback, useContext, useState } from "react";
import { FriendContext, SocketContext } from "./Home";

export const AddFriendModal = ({ isOpen, onClose }) => {
	const [error, setError] = useState("");
	const { setFriendList } = useContext(FriendContext);

	const { socket } = useContext(SocketContext);

	const closeModal = useCallback(() => {
		onClose();
		setError("");
	}, [onClose]);

	return (
		<Modal isOpen={isOpen} onClose={closeModal} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Friend</ModalHeader>
				<ModalCloseButton />
				<Formik
					initialValues={{ friendName: "" }}
					onSubmit={(values, actions) => {
						// alert(JSON.stringify(values, null, 2));
						socket.emit(
							"add_friend",
							values.friendName,
							({ errorMessage, done, friendData }) => {
								if (done) {
									setFriendList((friendList) => [friendData, ...friendList]);
									closeModal();
									return;
								} else {
									// actions.resetForm();
									setError(errorMessage);
								}
							}
						);
					}}
				>
					<Form>
						<ModalBody>
							{error ? <Text color="red.500">{error}</Text> : ""}
							<TextField
								label="Friend's name"
								placeholder="Enter friend's username"
								autoComplete="off"
								name="friendName"
							/>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="blue" type="submit">
								Submit
							</Button>
						</ModalFooter>
					</Form>
				</Formik>
			</ModalContent>
		</Modal>
	);
};

export default AddFriendModal;
