import { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function UpdatePasswordPage() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const checkRecoverySession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      setHasSession(Boolean(data.session));
      if (error) setErrorMsg(error.message);
      setCheckingLink(false);
    };

    checkRecoverySession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) {
        setHasSession(true);
        setCheckingLink(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Your new password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('The passwords do not match.');
      return;
    }

    setLoading(true);
    const response = await updatePassword(password);
    if (response?.error) {
      setErrorMsg(response.error.message);
    } else {
      setUpdated(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" className="w-16 h-16 object-contain" alt="Altitude Ally Logo" />
          <span className="font-serif text-2xl font-bold italic text-primary">Altitude Ally</span>
        </div>

        {checkingLink ? (
          <p className="text-on-surface-variant">Checking your recovery link...</p>
        ) : updated ? (
          <section aria-live="polite">
            <CheckCircle2 className="text-primary mb-5" size={40} />
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface mb-3">Password updated</h1>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Your new password is ready. You can continue to your Altitude Ally account.
            </p>
            <Link
              to="/account"
              className="inline-flex w-full justify-center py-4 px-6 rounded-xl bg-primary text-on-primary font-bold text-lg shadow-lg"
            >
              Continue to account
            </Link>
          </section>
        ) : !hasSession ? (
          <section>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface mb-3">Link expired</h1>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              This recovery link is invalid or has expired. Request a new link to reset your password.
            </p>
            <Link
              to="/reset-password"
              className="inline-flex w-full justify-center py-4 px-6 rounded-xl bg-primary text-on-primary font-bold text-lg shadow-lg"
            >
              Request a new link
            </Link>
          </section>
        ) : (
          <section>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface mb-3">Choose a new password</h1>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Use at least 8 characters and choose a password you do not use elsewhere.
            </p>

            {errorMsg && (
              <div className="bg-error/10 text-error p-4 rounded-lg text-sm font-bold mb-6" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary" htmlFor="new-password">New password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary" htmlFor="confirm-password">Confirm new password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full py-4 px-6 rounded-xl bg-primary text-on-primary font-bold text-lg shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
