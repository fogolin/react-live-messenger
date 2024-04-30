import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import Chat from "./Chat";
import { createContext, useState } from "react";
import useSocketSetup from "./UseSocketSetup";

export const FriendContext = createContext();

export const Home = () => {
	const [friendList, setFriendList] = useState([]);

	useSocketSetup(setFriendList);

	return (
		<FriendContext.Provider value={{ friendList, setFriendList }}>
			<Tabs>
				<Grid templateColumns="repeat(10, 1fr)" height="100vh">
					<GridItem colSpan="3" borderRight="1px solid gray">
						<Sidebar />
					</GridItem>
					<GridItem colSpan="7">
						<Chat />
					</GridItem>
				</Grid>
			</Tabs>
		</FriendContext.Provider>
	);
};

export default Home;
