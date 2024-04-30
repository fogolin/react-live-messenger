import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import Chat from "./Chat";
import { createContext, useContext, useEffect, useState } from "react";

import useSocketSetup from "./UseSocketSetup";
import socketConnection from "../../socket";
import { AccountContext } from "../AccountContext";

export const FriendContext = createContext();
export const MessagesContext = createContext();
export const SocketContext = createContext();

export const Home = () => {
	const [friendList, setFriendList] = useState([]);
	const [messages, setMessages] = useState([]);
	const [friendIndex, setFriendIndex] = useState(0);

	const { user } = useContext(AccountContext);
	const [socket, setSocket] = useState(() => socketConnection(user));

	useEffect(() => {
		setSocket(() => socketConnection(user));
	}, [user]);

	useSocketSetup(setFriendList, setMessages, socket);

	return (
		<FriendContext.Provider value={{ friendList, setFriendList }}>
			<SocketContext.Provider value={{ socket }}>
				<Grid
					templateColumns="repeat(10, 1fr)"
					height="100vh"
					as={Tabs}
					onChange={(index) => setFriendIndex(index)}
				>
					<GridItem colSpan="3" borderRight="1px solid gray">
						<Sidebar />
					</GridItem>
					<GridItem colSpan="7" maxH="100vh">
						<MessagesContext.Provider value={{ messages, setMessages }}>
							{/* <Text>{friendList[friendIndex]?.userid}</Text> */}
							<Chat userid={friendList[friendIndex]?.userid} />
						</MessagesContext.Provider>
					</GridItem>
				</Grid>
			</SocketContext.Provider>
		</FriendContext.Provider>
	);
};

export default Home;
