import { VStack, Button, ButtonGroup, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";

import { formSchema } from "@whatsapp-clone/common";
import TextField from "../TextField";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AccountContext } from "../AccountContext";

export const Login = () => {
	const { setUser } = useContext(AccountContext);
	const navigate = useNavigate();
	const [error, setError] = useState(null);

	const initValues = {
		username: "",
		password: "",
	};

	return (
		<Formik
			initialValues={initValues}
			validationSchema={formSchema}
			onSubmit={(values, actions) => {
				// alert(JSON.stringify(values, null, 2));
				actions.resetForm();
				fetch("http://localhost:4000/auth/login", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				})
					.catch((err) => {
						return;
					})
					.then((res) => {
						if (!res) return;
						return res.json();
					})
					.then((data) => {
						if (!data) return;
						setUser({ ...data.data });

						if (data?.errors?.length > 0) {
							setError(data.status);
						} else if (data.data.loggedIn) navigate("/home");
					});
			}}
		>
			<VStack
				as={Form}
				w={{ base: "90%", md: "500px" }}
				m="auto"
				justify="center"
				h="100vh"
				spacing="1rem"
			>
				<Heading>Log In</Heading>
				{error ? <Text color="red.500">{error}</Text> : ""}

				<TextField
					name="username"
					label="Username"
					placeholder="Enter username"
					autoComplete="off"
				/>
				<TextField
					name="password"
					label="Password"
					placeholder="Enter password"
					autoComplete="off"
					type="password"
				/>

				<ButtonGroup mt="1rem">
					<Button type="submit" colorScheme="teal">
						Log In
					</Button>
					<Button onClick={() => navigate("/register")}>Create Account</Button>
				</ButtonGroup>
			</VStack>
		</Formik>
	);
};
