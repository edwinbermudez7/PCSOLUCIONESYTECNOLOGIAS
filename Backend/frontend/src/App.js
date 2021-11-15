import React from 'react';
import './assets/css/App.css';
import { useAuth0 } from "@auth0/auth0-react";
//Importar Componentes
import { LoginButton } from "./components/Login";


import Router from './Router';



function App() {
  const { isAuthenticated } = useAuth0();
  return (
    <div className="App">

      {isAuthenticated ? (
        <>
          
          <Router />
        </>
      ) : (
        <LoginButton />
      )}
      

    </div>
  );
}

export default App;
