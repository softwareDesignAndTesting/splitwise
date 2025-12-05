// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Header from './components/Header';
import Footer from './components/Footer';
import UserGroups from './components/UserGroups';
import CreateGroup from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail';
import AddMember from './pages/AddMember';
import AddExpense from './pages/AddExpense';
import ExpenseDetail from './pages/ExpenseDetail';
import ErrorBoundary from './components/ErrorBoundary';



function LayoutWithHeaderFooter({ children }) {
  return (
    <div className="relative min-h-screen bg-app text-slate-900 overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-70 pointer-events-none" aria-hidden />
      <div className="absolute -top-32 right-0 w-72 h-72 bg-emerald-300/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-sky-200/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-rose-200/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <ToastContainer position="top-right" />
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/groups/:groupId" element={
          <LayoutWithHeaderFooter>
            <GroupDetail />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <LayoutWithHeaderFooter>
              <Dashboard />
            </LayoutWithHeaderFooter>
          }
        />
        <Route
          path="/analytics"
          element={
            <LayoutWithHeaderFooter>
              <Analytics />
            </LayoutWithHeaderFooter>
          }
        />
        <Route path="/groups/:groupId/add-member" element={
          <LayoutWithHeaderFooter>
            <AddMember />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/groups/:groupId/add-expense" element={
          <LayoutWithHeaderFooter>
            <AddExpense />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/expenses/:id" element={
          <LayoutWithHeaderFooter>
          <ExpenseDetail />
          </LayoutWithHeaderFooter>
          } />
      </Routes>
      </Router>
    </ErrorBoundary>
  );
}
