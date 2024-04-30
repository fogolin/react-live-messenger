import { AccountContext } from "../AccountContext";

const { useEffect, useContext } = require("react");
const { default: socket } = require("../../socket");

const useSocketSetup = (setFriendList) => {
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

		socket.on("connect_error", () => {
			console.log("The connection failed!");
			setUser({ loggedIn: false });
		});

		return () => {
			socket.off("connect_error");
		};
	}, [setUser, setFriendList]);
};

export default useSocketSetup;
