import { useNavigate } from "react-router-dom";

const { createContext, useState, useEffect } = require("react");

export const AccountContext = createContext();

const UserContext = ({children}) => {
    const [user, setUser] = useState({loggedIn: null});
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:4000/auth/login", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).catch(err => {
            setUser({loggedIn: false})
        }).then(res => {
            console.log("RES", res)
            if (!res ||!res.ok || res.status >= 400) {
                setUser({loggedIn: false})
                return
            };
            return res.json()
        }).then(data => {
            console.log("DATA", data)
            if(!data) {
                console.log("Not logged in")
                setUser({loggedIn: false})
                return
            };
            console.log("Logged in")
            navigate("/home")
            setUser({...data.data})
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <AccountContext.Provider value={{user, setUser}}>
        {children}
    </AccountContext.Provider>
}

export default UserContext