import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
    <App />
  </StrictMode>,
)
