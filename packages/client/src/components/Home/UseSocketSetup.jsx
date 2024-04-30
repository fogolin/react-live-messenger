import { AccountContext } from "../AccountContext";

const { useEffect, useContext } = require("react");
const { default: socket } = require("../../socket");

const useSocketSetup = (setFriendList, setMessages) => {
	const { setUser } = useContext(AccountContext);

	useEffect(() => {
		socket.connect();

		socket.on("friends", (friendList) => setFriendList(friendList));

		socket.on("connected", (status, username) => {
			setFriendList((currentFriendList) => {
				return [...currentFriendList].map((friend) => {
					if (friend.username === username) {
						friend.connected = status;
					}
					return friend;
				});
			});
		});

		socket.on("messages", (messages) => {
			setMessages(messages);
		});

		socket.on("message:direct", (message) => {
			setMessages((currentMessages) => [message, ...currentMessages]);
		});

		socket.on("connect_error", () => {
			console.log("The connection failed!");
			setUser({ loggedIn: false });
		});

		return () => {
			const keys = [
				"friends",
				"connected",
				"messages",
				"message:direct",
				"connect_error",
			];

			// Disconnect from all IO
			for (const key of keys) {
				socket.off(key);
			}
		};
	}, [setUser, setFriendList, setMessages]);
};

export default useSocketSetup;
