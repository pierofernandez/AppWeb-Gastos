import { AuthProvider } from './context/AuthContext';
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <AppRouter />
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
