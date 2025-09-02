import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const userData = await api.getMe();
      setUser(userData);
      setAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('jwt_token');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      const isAuthPage = location.pathname === '/auth';
      
      if (!authenticated && !isAuthPage) {
        navigate('/auth');
      } else if (authenticated && isAuthPage) {
        navigate('/dashboard');
      }
    }
  }, [authenticated, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;