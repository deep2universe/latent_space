import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import App from './App.tsx'
import './index.css'
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

// Enable debug logging for API calls
Amplify.configure({
  ...outputs,
  Logging: {
    level: 'DEBUG'
  }
});

/**
 * Initialize the React application by rendering the root component
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <App />
        </main>
      )}
    </Authenticator>
  </StrictMode>,
)
