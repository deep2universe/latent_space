import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import App from './App.tsx'
import './index.css';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

// Enable debug logging for API calls
Amplify.configure({
  ...outputs
});

/**
 * Initialize the React application by rendering the root component
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator signUpAttributes={[]}>
      {({ signOut, user }) => (
        <>
          <main>
            <App />
          </main>
        </>
      )}
    </Authenticator>
  </StrictMode>,
)
