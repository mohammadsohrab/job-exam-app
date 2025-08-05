import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface AuthHandlerProps {
  onLogin: (token: string, username: string, role: string) => void;
}

const AuthHandler: React.FC<AuthHandlerProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <Login 
          onLogin={onLogin}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <Signup 
          onLogin={onLogin}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </>
  );
};

export default AuthHandler;