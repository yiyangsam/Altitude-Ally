import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { User, Lock, ArrowLeft, ArrowRight, Eye, EyeOff, UserPlus, AlertCircle, MailCheck, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CustomerLoginPage() {
  const { isLoggedIn, login, register, resendSignupConfirmation } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationSent, setRegistrationSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isLoggedIn) navigate('/account', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (isSignUp) {
      if (!name) {
        setErrorMsg("Please provide your name.");
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setErrorMsg("Your password must be at least 8 characters.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("The passwords do not match.");
        setLoading(false);
        return;
      }
      const response = await register(name, email, password);
      // @ts-ignore
      if (response?.error) {
        // @ts-ignore
        setErrorMsg(response.error.message);
      } else {
        setRegistrationSent(true);
      }
    } else {
      const response = await login(email, password);
      // @ts-ignore
      if (response?.error) {
        // @ts-ignore
        setErrorMsg(response.error.message);
      } else {
        navigate('/account');
      }
    }

    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    setIsResending(true);
    setResendMessage(null);

    const response = await resendSignupConfirmation(email);

    if (response?.error) {
      const message = response.error.message?.toLowerCase() || '';
      setResendMessage({
        type: 'error',
        text: message.includes('rate limit') || message.includes('seconds')
          ? 'Please wait a minute before requesting another email.'
          : 'We could not resend the email. Please try again shortly.'
      });
    } else {
      setResendMessage({
        type: 'success',
        text: 'A new verification email has been sent.'
      });
    }

    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Brand Panel */}
      <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-24">
        <div className="relative z-10 text-on-primary">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" className="w-40 h-40" alt="Altitude Ally Logo" />
            <span className="text-3xl font-bold tracking-tighter">Altitude Ally</span>
          </div>
          <h1 className="text-6xl font-bold font-serif italic leading-tight">Welcome back.</h1>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center p-3 md:p-24 bg-surface-container-lowest">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="md:hidden flex flex-col items-center mb-6">
            <img src="/logo.png" className="w-40 h-40 mb-2" alt="Altitude Ally Logo" />
            <h2 className="text-xl font-bold font-serif italic text-primary">Altitude Ally</h2>
          </div>

          {(isSignUp || registrationSent) && (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:underline underline-offset-4 mb-6"
            >
              <ArrowLeft size={18} />
              Back to home
            </button>
          )}

          {registrationSent ? (
            <div className="py-4" aria-live="polite">
              <MailCheck className="text-primary mb-5" size={42} />
              <h3 className="text-2xl md:text-4xl font-bold text-on-surface mb-3 font-serif">Check your email</h3>
              <p className="text-on-surface-variant mb-8 text-sm md:text-base leading-relaxed">
                We sent an approval link to <strong className="text-on-surface">{email}</strong>. Open it to verify your details and activate your account.
              </p>
              <p className="text-on-surface-variant mb-4 text-sm leading-relaxed">
                If this address was used before or the first link expired, request a new link below.
              </p>
              {resendMessage && (
                <p
                  className={`mb-4 text-sm font-semibold ${resendMessage.type === 'success' ? 'text-emerald-700' : 'text-error'}`}
                  role="status"
                >
                  {resendMessage.text}
                </p>
              )}
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isResending}
                className="w-full mb-3 py-3.5 md:py-4 rounded-xl border-2 border-primary text-primary font-bold text-base transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} className={isResending ? 'animate-spin' : ''} />
                {isResending ? 'Sending...' : 'Resend verification email'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegistrationSent(false);
                  setIsSignUp(false);
                  setPassword('');
                  setConfirmPassword('');
                  setShowConfirmPassword(false);
                  setResendMessage(null);
                }}
                className="w-full py-3.5 md:py-4 rounded-xl bg-primary text-on-primary font-bold text-base shadow-lg"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl md:text-4xl font-bold text-on-surface mb-1 font-serif">
                {isSignUp ? "Create Account" : "Sign In"}
              </h3>
              <p className="text-on-surface-variant mb-6 text-xs md:text-base">
                {isSignUp ? "Join us." : "Log in to your Altitude Ally account."}
              </p>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error/10 text-error p-4 rounded-xl flex items-center gap-2 text-sm mb-6 font-bold"
              >
                <AlertCircle size={20} />
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">

            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  className="space-y-1 md:space-y-2 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[10px] md:text-sm font-bold text-secondary uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-4 h-4 md:w-5 md:h-5" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm md:text-base"
                      placeholder="Enter full name"
                      type="text"
                      autoComplete="name"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-sm font-bold text-secondary uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-4 h-4 md:w-5 md:h-5" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm md:text-base"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 md:space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] md:text-sm font-bold text-secondary uppercase tracking-widest">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="text-[10px] md:text-xs text-primary font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-4 h-4 md:w-5 md:h-5" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 md:py-4 rounded-xl md:rounded-2xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm md:text-base"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={isSignUp ? 8 : undefined}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  className="space-y-1 md:space-y-2 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[10px] md:text-sm font-bold text-secondary uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-4 h-4 md:w-5 md:h-5" />
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 md:py-4 rounded-xl md:rounded-2xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm md:text-base"
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 md:py-5 rounded-xl md:rounded-2xl bg-primary text-on-primary font-bold text-base md:text-xl shadow-xl hover:shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 opacity-100 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />}
            </button>
              </form>

              <p className="text-center mt-8 text-on-surface-variant text-[10px] md:text-sm italic">
            {isSignUp ? "Already a member?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setConfirmPassword('');
                setShowConfirmPassword(false);
                setResendMessage(null);
              }}
              className="text-primary font-bold not-italic hover:underline ml-1"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
