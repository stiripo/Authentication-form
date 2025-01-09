import './App.css';
import { Authform } from './AuthForm';
import { makeServer } from './mirage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    let server;
    server = makeServer();
    return () => {
      server.shutdown();
    };
  }, []);
  return (
    <Authform />
  );
}

export default App;
