import {
    VStack,
    Button,
    ButtonGroup,
    Heading,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import TextField from "./TextField"
import { useNavigate } from "react-router-dom"


export const SignUp = () => {
    const navigate = useNavigate();
    
    const initValues = {
        username: "",
        password: "",
    }

    const validValues = Yup.object({
        username: Yup.string()
            .required("Username is required.")
            .min(6, "Username too short.")
            .max(24, "Username too long."),
        password: Yup.string()
            .required("password is required.")
    })

    
    return (
        <Formik
            initialValues={initValues}
            validationSchema={validValues}
            onSubmit={(values, actions) => {
                alert(JSON.stringify(values, null, 2));
                actions.resetForm();
                fetch("https://localhost:4000/auth/register", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                }).catch(err => {
                    return
                }).then(res => {
                    if (!res || !res.ok || res.status >= 400) {
                        return
                    }
                    return res.json()
                }).then(data => {
                    if(!data) return;
                    console.log("DATA", data)
                })
            }}
        >
            <VStack
                as={Form}
                w={{base: "90%", md: "500px"}}
                m="auto" 
                justify="center" 
                h="100vh" 
                spacing="1rem"
            >
                <Heading>Sign Up</Heading>
                
                <TextField name="username" label="Username" placeholder="Enter username" autoComplete="off" />
                <TextField name="password" label="Password" placeholder="Enter password" autoComplete="off" type="password" />
                
                <ButtonGroup mt="1rem">
                    <Button type="submit" colorScheme="teal">Sign Up</Button>
                    <Button onClick={() => navigate("/")}>Login</Button>
                </ButtonGroup>
            </VStack>
    </Formik>
  )
}
