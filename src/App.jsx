import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AppDataProvider } from '@/lib/AppDataContext';
import Configurator from '@/pages/Configurator';
import SalesPresentation from '@/pages/SalesPresentation';
import Admin from '@/pages/Admin';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<SalesPresentation />} />
      <Route path="/sales" element={<SalesPresentation />} />
      <Route path="/configurator" element={<Configurator />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppDataProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </AppDataProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App