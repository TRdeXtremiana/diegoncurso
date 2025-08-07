import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListaPreguntas from "./pages/admin/ListaPreguntas";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider } from "./context/AuthContext";
import { PreguntasProvider } from "./context/PreguntasContext";
import { NotificationProvider } from "./context/NotificationContext";
import NetworkErrorHandler from "./components/common/NetworkErrorHandler";
import ErrorBoundary from "./components/common/ErrorBoundary";
import DebugPanel from "./components/debug/DebugPanel";
import { useNotification } from "./context/NotificationContext";
import "./App.css";

// Componente interno para usar hooks dentro del ErrorBoundary
function AppContent() {
  const { showWarning } = useNotification();

  // Manejador de errores para el ErrorBoundary
  const handleError = (error) => {
    showWarning("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
  };

  return (
    <NetworkErrorHandler>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <ErrorBoundary onError={handleError}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/preguntas" element={<ListaPreguntas />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
        {/* Panel de depuración solo visible en desarrollo */}
        {process.env.NODE_ENV === 'development' && <DebugPanel />}
      </div>
    </NetworkErrorHandler>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <PreguntasProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </PreguntasProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
