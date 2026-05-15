import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon } from '@phosphor-icons/react';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const storedUser = JSON.parse(localStorage.getItem('mockUser'));
      const isValidDemo = email === 'demo@university.edu' && password === 'password123';
      const isValidStored = storedUser && email === storedUser.email && password === storedUser.password;
      
      if (!isValidDemo && !isValidStored) {
        alert('Invalid credentials! Try resetting the password or use your registered information.');
        return;
      }
    } else {
      localStorage.setItem('mockUser', JSON.stringify({ email, password }));
      alert('Account Created Successfully! You can now log in.');
      setIsLogin(true);
      return;
    }
    navigate('/dashboard');
  };

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const userInfo = await res.json();
      
      localStorage.setItem('mockUser', JSON.stringify({ 
        email: userInfo.email, 
        name: userInfo.name,
        picture: userInfo.picture 
      }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to fetch user info from Google', error);
      alert('Failed to get user details from Google');
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      console.log('Login Failed');
      alert('Google Login Failed');
    }
  });

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    loginWithGoogle();
  };

  return (
    <div className="bg-surface dark:bg-[#111418] text-on-surface dark:text-gray-100 antialiased min-h-screen flex flex-col w-full transition-colors duration-300">
      <main className="flex-grow flex flex-col md:flex-row h-screen overflow-hidden">
        
        {/* Left Side (Visual Panel) */}
        <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-primary dark:bg-primary-container items-center justify-center p-12 transition-colors duration-300">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              alt="Abstract blue flowing shapes" 
              className="w-full h-full object-cover mix-blend-overlay" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeIJdhP0dMC4EOtTn1AHNbcRyf4MIfQAW_9IIsU5oG4r2aSyFentEdRXEzowkMg7pUpQVoB6znR2-qbEWtxi1fVceettDUZiChJ82h4aT5b1xIxA_nqpoS4rGqB7OzQMU77epBzooC0lp5cf22XW2ixayyApzTP-GtZg5JopxFYI963iTgDsvfwD1X53xTSbJ08Uz3Wo1Cqfa8L9gmeKRNifbq5qTv5XXB2hMft04bww8L2h7qsUvzETA3fobVdUTr6Gq6IqgoYCjX"
            />
          </div>
          <div className="relative z-10 max-w-lg text-white">
            <div className="mb-8">
              <span className="text-3xl font-black tracking-tighter uppercase mb-2 block">InsightFlow</span>
              <div className="h-1 w-12 bg-white rounded-full"></div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Editorial-grade precision for modern research.
            </h1>
            <p className="text-xl text-primary-fixed-dim dark:text-gray-300 leading-relaxed font-light mb-12">
              Experience the fluid workspace designed to adapt to your research flow. Join a community of thinkers transforming data into discovery.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <span className="material-symbols-outlined text-3xl mb-3" style={{fontFamily: "'Material Symbols Outlined'"}}></span>
                <h3 className="text-lg font-semibold mb-1 flex justify-center">AI Synthesis</h3>
                <p className="text-sm text-white/70 flex justify-center">Automatic paper summarization and insight mapping.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <span className="material-symbols-outlined text-3xl mb-3" style={{fontFamily: "'Material Symbols Outlined'"}}></span>
                <h3 className="text-lg font-semibold mb-1 flex justify-center">Collections</h3>
                <p className="text-sm text-white/70 flex justify-center">Organize references with intelligent tagging.</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-xs text-white/50 tracking-widest uppercase">
            <span>© 2026 InsightFlow AI</span>
          </div>
        </section>

        {/* Right Side (Form Panel) */}
        <section className="flex-1 flex items-center justify-center bg-surface dark:bg-[#1a1c23] p-8 md:p-16 lg:p-24 overflow-y-auto w-full relative transition-colors duration-300">
          
          <button 
            onClick={toggleTheme} 
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-container-high dark:bg-gray-800 hover:bg-surface-variant dark:hover:bg-gray-700 flex items-center justify-center transition-colors shadow-sm outline-none border border-transparent dark:border-gray-700"
          >
            {isDarkMode ? <Sun size={24} className="text-amber-400" weight="fill" /> : <Moon size={24} className="text-primary" weight="fill" />}
          </button>

          <div className="w-full max-w-md">
            <div className="md:hidden mb-12 flex justify-center">
              <span className="text-2xl font-black tracking-tighter text-primary dark:text-primary-container">InsightFlow</span>
            </div>
            <header className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-on-surface dark:text-gray-50 mb-2 transition-colors">
                {isLogin ? 'Welcome back' : 'Create an Account'}
              </h2>
              <p className="text-on-surface-variant dark:text-gray-400 font-medium text-center justify-center md:text-left transition-colors">
                {isLogin ? 'Please enter your details to sign in.' : 'Please fill in the form to register.'}
              </p>
            </header>
            
            {isLogin && (
              <div className="space-y-4 mb-10">
                <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full bg-surface-container-lowest dark:bg-gray-800 border border-outline-variant/30 dark:border-gray-700 hover:bg-surface-container-low dark:hover:bg-gray-700 transition-all duration-200 group">
                  <img alt="Google Logo" className="w-7 h-7" src="https://icon2.cleanpng.com/20180728/ra/93f307e6dd7cef0dfd4fc937632602e7.webp" />
                  <span className="text-sm font-semibold text-on-surface dark:text-gray-100">Continue with Google</span>
                </button>
              </div>
            )}

            {isLogin && (
              <div className="relative mb-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/20 dark:border-gray-700 transition-colors"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-surface dark:bg-[#1a1c23] px-4 text-on-surface-variant/60 dark:text-gray-400 font-bold transition-colors">Or continue with email</span>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-on-surface-variant dark:text-gray-400 ml-1 transition-colors">Full Name</label>
                  <input required className="w-full px-5 py-4 rounded-lg bg-surface-container-lowest dark:bg-gray-800 border-0 ring-1 ring-outline-variant/20 dark:ring-gray-700 focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-container focus:bg-surface-container-low dark:focus:bg-gray-700 transition-all outline-none text-on-surface dark:text-gray-100 dark:placeholder-gray-500" placeholder="Dr. Jane Doe" type="text" />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-on-surface-variant dark:text-gray-400 ml-1 transition-colors" htmlFor="email">Email Address</label>
                <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-lg bg-surface-container-lowest dark:bg-gray-800 border-0 ring-1 ring-outline-variant/20 dark:ring-gray-700 focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-container focus:bg-surface-container-low dark:focus:bg-gray-700 transition-all outline-none text-on-surface dark:text-gray-100 dark:placeholder-gray-500" id="email" placeholder="dr.aris@university.edu" type="email"/>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold uppercase text-on-surface-variant dark:text-gray-400 transition-colors" htmlFor="password">Password</label>
                  {isLogin && <a className="text-xs font-bold text-primary dark:text-primary-container hover:text-primary-container transition-colors" href="#">Forgot Password?</a>}
                </div>
                <div className="relative">
                  <input required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-lg bg-surface-container-lowest dark:bg-gray-800 border-0 ring-1 ring-outline-variant/20 dark:ring-gray-700 focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-container focus:bg-surface-container-low dark:focus:bg-gray-700 transition-all outline-none text-on-surface dark:text-gray-100 dark:placeholder-gray-500" id="password" placeholder="••••••••" type="password"/>
                </div>
              </div>
              
              {isLogin && (
                <div className="flex items-center gap-3 px-1">
                  <input className="w-5 h-5 rounded border-outline-variant/40 dark:border-gray-600 dark:bg-gray-800 text-primary dark:text-primary-container focus:ring-primary/20 dark:focus:ring-primary-container/20 transition-colors" id="remember" type="checkbox"/>
                  <label className="text-sm text-on-surface-variant dark:text-gray-400 font-medium select-none transition-colors" htmlFor="remember">Remember me for 30 days</label>
                </div>
              )}
              
              <button className="w-full py-4 px-6 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/20 dark:shadow-black/50 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200" type="submit">
                {isLogin ? 'Sign In to Dashboard' : 'Create My Account'}
              </button>
            </form>

            <footer className="mt-12 text-center flex flex-col gap-4">
              <p className="text-sm text-on-surface-variant dark:text-gray-400 font-medium transition-colors">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-primary dark:text-primary-container font-bold hover:underline ml-2 bg-transparent border-none cursor-pointer transition-colors"
                >
                  {isLogin ? 'Create an account' : 'Sign In instead'}
                </button>
              </p>
              <Link to="/" className="text-sm text-outline dark:text-gray-500 hover:text-on-surface dark:hover:text-gray-300 transition-colors mt-4">
                 ← Return to Landing Page
              </Link>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Login;
