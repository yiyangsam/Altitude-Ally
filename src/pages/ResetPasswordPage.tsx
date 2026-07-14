import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function ResetPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const response = await requestPasswordReset(email.trim());
    if (response?.error) {
      setErrorMsg(response.error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 mb-8 text-sm text-primary font-bold hover:underline underline-offset-4"
        >
          <ArrowLeft size={18} />
          Back to sign in
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" className="w-16 h-16 object-contain" alt="Altitude Ally Logo" />
          <span className="font-serif text-2xl font-bold italic text-primary">Altitude Ally</span>
        </div>

        {sent ? (
          <section aria-live="polite">
            <CheckCircle2 className="text-primary mb-5" size={40} />
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface mb-3">Check your email</h1>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              If an Altitude Ally account exists for <strong className="text-on-surface">{email}</strong>, a password reset link is on its way.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-primary font-bold hover:underline underline-offset-4"
            >
              Try another email
            </button>
          </section>
        ) : (
          <section>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface mb-3">Forgot your password?</h1>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Enter your account email and we will send you a secure link to choose a new password.
            </p>

            {errorMsg && (
              <div className="bg-error/10 text-error p-4 rounded-lg text-sm font-bold mb-6" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary" htmlFor="reset-email">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="reset-email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <button
                className="w-full py-4 px-6 rounded-xl bg-primary text-on-primary font-bold text-lg shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send reset link'}
                {!loading && <Send size={20} />}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
