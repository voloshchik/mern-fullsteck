import React from 'react';
import 'materialize-css';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './component/Navbar';
function App() {
  const { login, logout, token, userId } = useAuth();

  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        token,
        userId,
        isAuthenticated,
      }}
    >
      <BrowserRouter>
        {isAuthenticated && <Navbar />}
        <div className='container'>{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
