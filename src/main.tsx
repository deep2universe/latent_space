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
          {!user && (
            <div className="video-background">
              <video autoPlay loop muted className="video-content">
                <source src="https://cdn.pixabay.com/video/2021/09/11/88207-602915574_large.mp4" type="video/mp4" />
              </video>
            </div>
          )}
          <main>
            <App />
          </main>
        </>
      )}
    </Authenticator>
  </StrictMode>,
)
