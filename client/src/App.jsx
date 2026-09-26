import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import WebinarsPage from './pages/WebinarsPage';
import EBookLibraryPage from './pages/EBookLibraryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import LearningPage from './pages/LearningPage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';
import ProgrammingLab from './pages/ProgrammingLab';
import LearningProfilePage from './pages/LearningProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';
import DoubtsPage from './pages/DoubtsPage';

// Teacher & Admin Pages
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors theme="dark" />
      <BrowserRouter>
        <Routes>
          {/* Main Layout wrapper for Navbar & Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/webinars" element={<WebinarsPage />} />
            <Route path="/library" element={<EBookLibraryPage />} />
            <Route path="/ebooks" element={<EBookLibraryPage />} />
            
            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<CoursesPage />} />
              <Route path="/student/learn/:courseId" element={<LearningPage />} />
              <Route path="/student/profile" element={<LearningProfilePage />} />
              <Route path="/student/skill-tree" element={<LearningProfilePage />} />
              <Route path="/student/lab" element={<ProgrammingLab />} />
              <Route path="/student/recommendations" element={<RecommendationsPage />} />
              <Route path="/student/doubts" element={<DoubtsPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/quiz-result" element={<QuizResultPage />} />
            </Route>

            {/* Teacher Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/matrix" element={<TeacherDashboard />} />
              <Route path="/teacher/courses" element={<CoursesPage />} />
              <Route path="/teacher/questions" element={<QuizPage />} />
              <Route path="/teacher/doubts" element={<DoubtsPage />} />
              <Route path="/teacher/content" element={<BlogsPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Auth standalone pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
