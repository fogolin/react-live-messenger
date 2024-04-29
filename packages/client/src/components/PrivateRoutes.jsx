import { Navigate, Outlet } from "react-router-dom";
import { AccountContext } from "./AccountContext";
import { useContext } from "react";

const useAuth = () => {
    const {user} = useContext(AccountContext);
    return user && user?.loggedIn
}

const PrivateRoutes = () => {
    const isAuth = useAuth();
    return isAuth === true
        ? <Outlet />
        : <Navigate to="/login" />
}

export default PrivateRoutes