import React from 'react';
import AuthPage from '../components/auth/AuthPage';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <AuthPage title="Create Your Account">
      <RegisterForm />
    </AuthPage>
  );
};

export default Register;
