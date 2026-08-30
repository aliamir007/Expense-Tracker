import { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function AuthGate() {
  const [mode, setMode] = useState('login');
  const [prefillEmail, setPrefillEmail] = useState('');

  if (mode === 'register') {
    return (
      <Register
        onSwitch={() => setMode('login')}
        onRegistered={(email) => {
          setPrefillEmail(email);
          setMode('login');
        }}
      />
    );
  }

  return <Login onSwitch={() => setMode('register')} prefillEmail={prefillEmail} />;
}
