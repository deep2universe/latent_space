import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import App from './App.tsx'
import './index.css';
import './login.css';
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
            <video autoPlay loop muted>
              <source src="https://cdn.pixabay.com/video/2021/09/11/88207-602915574_large.mp4" type="video/mp4" />
            </video>
          )}
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
            <HUD 
              timeLeft={timeLeft} 
              onShopClick={() => setShowShop(true)}
              viewMode={viewMode}
              onViewModeChange={() => setViewMode(prev => prev === 'cards' ? 'world' : 'cards')}
              onSignOut={signOut}
            />
            <App />
          </main>
        </>
      )}
    </Authenticator>
  </StrictMode>,
)
