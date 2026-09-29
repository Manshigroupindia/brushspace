import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container flex flex-col justify-center items-center p-4">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant font-medium">
          Verifying Studio Authentication...
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-2xl shadow-xl border border-outline-variant/20">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo showText={false} className="h-12 w-12 mb-3" />
          <h1 className="font-headline-md text-headline-md text-on-surface font-semibold">
            Atelier Studio Console
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Restricted access for Brushspace curators &amp; store managers
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-error-container/40 text-on-error-container text-body-sm font-body-sm border border-error/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1.5 font-semibold">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@brushspace.com"
              className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1.5 font-semibold">
              Security Key / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN TO CONSOLE'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/15 text-center">
          <p className="font-label-sm text-label-sm text-outline">
            Brushspace Atelier Private Management System
          </p>
        </div>
      </div>
    </div>
  );
};
