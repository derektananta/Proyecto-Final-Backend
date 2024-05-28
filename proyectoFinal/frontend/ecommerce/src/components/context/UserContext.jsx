import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/current");
                setCurrentUser(response.data.payload);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    // Utilizar useMemo para memoizar el valor de currentUser
    const memoizedCurrentUser = useMemo(() => currentUser, [currentUser]);

    return (
        <UserContext.Provider value={{ currentUser: memoizedCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};
