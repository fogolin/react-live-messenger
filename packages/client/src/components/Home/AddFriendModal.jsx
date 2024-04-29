import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import TextField from "../TextField";
import { Form, Formik } from "formik";

export const AddFriendModal = ({ isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Friend</ModalHeader>
				<ModalCloseButton />
				<Formik
					initialValues={{ friendName: "" }}
					onSubmit={(values, actions) => {
						alert(JSON.stringify(values, null, 2));
						actions.resetForm();
					}}
				>
					<Form>
						<ModalBody>
							<TextField
								label="friend's name"
								placeholder="Enter friend's username"
								autoComplete="off"
								name="friendName"
							/>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="blue" onClick={onClose} type="submit">
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
