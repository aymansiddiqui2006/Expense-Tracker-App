import { UserContext } from "./UserContext";
import { useState } from "react";

const UserProvider = ({ children }) => {
    const [user, setuser] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateUser = (userData) => {
        setuser(userData)
        setLoading(false)
    }

    const clearUser = () => {
        setuser(null);
        setLoading(false)
    }

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
            {children}
        </UserContext.Provider>
    )

}






export default UserProvider 