import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for user data
    const savedUser = localStorage.getItem('jian_app_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      document.body.className = `theme-${parsedUser.theme}`;
    } else {
      // Default to doll theme if no user
      document.body.className = 'theme-doll';
    }
  }, []);

  const handleOnboardingComplete = (userData) => {
    localStorage.setItem('jian_app_user', JSON.stringify(userData));
    setUser(userData);
    document.body.className = `theme-${userData.theme}`;
  };

  const handleResetUser = () => {
    localStorage.removeItem('jian_app_user');
    setUser(null);
    document.body.className = 'theme-doll';
  }

  return (
    <>
      {!user ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard user={user} onReset={handleResetUser} />
      )}
    </>
  )
}

export default App
