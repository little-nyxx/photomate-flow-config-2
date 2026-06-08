import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Configurator from '@/pages/Configurator';
import SalesPresentation from '@/pages/SalesPresentation';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<SalesPresentation />} />
      <Route path="/sales" element={<SalesPresentation />} />
      <Route path="/configurator" element={<Configurator />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App