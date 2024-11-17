import React from 'react';
import AuthPage from '../components/auth/AuthPage';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthPage title="Welcome Back">
      <LoginForm />
    </AuthPage>
  );
};

export default Login;
