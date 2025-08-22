
import React, { createContext, useState } from "react";

//creao una const para acceder a ella desde cualquier pantalla
export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState({
    });



    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );

}
