// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/common/Layout';
import HomePage from './HomePage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Profile from './components/Profile';
import SavedPets from './components/SavedPets';
import Search from './components/Search';
import PetDetail from './components/PetDetail';
import AddPet from './components/AddPet';
import PetGuide from './components/guide/PetGuide';
import PetGuideArticle from './components/guide/PetGuideArticle';
import DogBreedGuide from './components/guide/DogBreedGuide';
import CatBreedGuide from './components/guide/CatBreedGuide';
import FirstTimeOwnerGuide from './components/guide/FirstTimeOwnerGuide';
import PetNutritionGuide from './components/guide/PetNutritionGuide';
import GroomingGuide from './components/guide/GroomingGuide';
import TrainingGuide from './components/guide/TrainingGuide';
import HealthGuide from './components/guide/HealthGuide';
import About from './components/About';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import MessagesPage from './components/MessagesPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/search" element={<Search />} />
                <Route path="/pets/:id" element={<PetDetail />} />
                <Route path="/pet-guide" element={<PetGuide />} />
                <Route path="/dog-breed-guide" element={<DogBreedGuide />} />
                <Route path="/cat-breed-guide" element={<CatBreedGuide />} />
                <Route path="/first-time-owner-guide" element={<FirstTimeOwnerGuide />} />
                <Route path="/pet-nutrition-guide" element={<PetNutritionGuide />} />
                <Route path="/grooming-guide" element={<GroomingGuide />} />
                <Route path="/training-guide" element={<TrainingGuide />} />
                <Route path="/health-guide" element={<HealthGuide />} />
                <Route path="/pet-guide/:articleId" element={<PetGuideArticle />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved-pets"
                  element={
                    <ProtectedRoute>
                      <SavedPets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-pet"
                  element={
                    <ProtectedRoute>
                      <AddPet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-pet/:id"
                  element={
                    <ProtectedRoute>
                      <AddPet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
