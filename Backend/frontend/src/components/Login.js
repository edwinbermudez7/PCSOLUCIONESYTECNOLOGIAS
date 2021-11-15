import React from "react";
import { useAuth0 } from "@auth0/auth0-react";




export const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div class="text-center"> 
            <form className="form-signin">
            <img className="mb-4" src="https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile.png" alt="" width="72" height="72" />
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
            <button className="btn btn-lg btn-primary btn-block" onClick={() => loginWithRedirect()}>Login</button>
            
            <p className="mt-5 mb-3 text-muted">&copy; MISIONTIC-2021</p>
            </form>
        </div>
    )
};