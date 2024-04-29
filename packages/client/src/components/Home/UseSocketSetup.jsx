import { AccountContext } from "../AccountContext";

const { useEffect, useContext } = require("react");
const { default: socket } = require("../../socket");

const useSocketSetup = () => {
	const { setUser } = useContext(AccountContext);

	useEffect(() => {
		socket.connect();
		socket.on("connect_error", () => {
			console.log("The connection failed!");
			setUser({ loggedIn: false });
		});

		return () => {
			socket.off("connect_error");
		};
	}, [setUser]);
};

export default useSocketSetup;
