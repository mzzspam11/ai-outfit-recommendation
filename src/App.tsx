import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Quiz from './components/Quiz';
import Recommendation from './components/Recommendation';
import Closet from './components/Closet';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string> | undefined>(undefined);

  const handleQuizComplete = (answers: Record<string, string>) => {
    setQuizAnswers(answers);
    setCurrentPage('recommendation');
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers(undefined);
    setCurrentPage('quiz');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'quiz':
        return <Quiz onComplete={handleQuizComplete} onNavigate={setCurrentPage} />;
      case 'recommendation':
        return (
          <Recommendation
            quizAnswers={quizAnswers}
            onNavigate={setCurrentPage}
            onRetakeQuiz={handleRetakeQuiz}
          />
        );
      case 'closet':
        return <Closet onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onSwitchToSignup={() => setCurrentPage('signup')} />;
      case 'signup':
        return <Signup onNavigate={setCurrentPage} onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'edit-profile':
        return <EditProfile onNavigate={setCurrentPage} onClose={() => setCurrentPage('profile')} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;
