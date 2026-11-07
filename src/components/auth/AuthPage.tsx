import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Building,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Award,
} from 'lucide-react';
import type { StudentProfile } from '../../types/scholarship';

const DEMO_PERSONAS: {
  id: string;
  name: string;
  email: string;
  university: string;
  role: string;
  cgpa: number;
  category: string;
  profileData: Partial<StudentProfile>;
}[] = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitd.ac.in',
    university: 'IIT Delhi',
    role: 'B.Tech CSE • 2nd Year (EWS)',
    cgpa: 8.65,
    category: 'General (EWS) • First-Gen',
    profileData: {
      fullName: 'Aarav Sharma',
      university: 'IIT Delhi',
      course: 'B.Tech Computer Science & Engineering',
      currentYear: '2nd Year',
      academicLevel: 'Undergraduate',
      branch: 'Computer Science & Engineering',
      marksCgpa: 8.65,
      marksPercentage: 82.2,
      socialCategory: 'General (EWS)',
      familyAnnualIncome: '₹2.5L - ₹5 Lakhs',
      regionState: 'Delhi',
      isFirstGen: true,
      isSingleGirlChild: false,
      targetAnnualFees: 180000,
      isOnboardingCompleted: true,
    },
  },
  {
    id: 'ananya',
    name: 'Ananya Patel',
    email: 'ananya.patel@aiims.edu',
    university: 'AIIMS New Delhi',
    role: 'MBBS / Biotech • 1st Year (Single Girl)',
    cgpa: 9.15,
    category: 'OBC (Non-Creamy) • Girl Child',
    profileData: {
      fullName: 'Ananya Patel',
      university: 'AIIMS New Delhi',
      course: 'B.Tech Biotechnology & Biomedical',
      currentYear: '1st Year',
      academicLevel: 'Undergraduate',
      branch: 'Biotechnology',
      marksCgpa: 9.15,
      marksPercentage: 87.0,
      socialCategory: 'OBC (Non-Creamy Layer)',
      familyAnnualIncome: '< ₹2.5 Lakhs (Full EWS)',
      regionState: 'Karnataka',
      isFirstGen: false,
      isSingleGirlChild: true,
      targetAnnualFees: 140000,
      isOnboardingCompleted: true,
    },
  },
  {
    id: 'rohan',
    name: 'Rohan Verma',
    email: 'rohan.verma@iitb.ac.in',
    university: 'IIT Bombay',
    role: 'M.Tech AI • PMRF Fellowship Track',
    cgpa: 8.90,
    category: 'SC Category • Research Scholar',
    profileData: {
      fullName: 'Rohan Verma',
      university: 'IIT Bombay',
      course: 'M.Tech Artificial Intelligence & Robotics',
      currentYear: 'Postgraduate',
      academicLevel: 'Postgraduate',
      branch: 'Electrical & AI Engg',
      marksCgpa: 8.90,
      marksPercentage: 84.5,
      socialCategory: 'SC',
      familyAnnualIncome: '₹5L - ₹8 Lakhs (Non-Creamy Limit)',
      regionState: 'Maharashtra',
      isFirstGen: true,
      isSingleGirlChild: false,
      targetAnnualFees: 220000,
      isOnboardingCompleted: true,
    },
  },
];

export const AuthPage: React.FC = () => {
  const { setCurrentView, login, updateProfile, theme, toggleTheme } = useScholarshipContext();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [error, setError] = useState('');

  const handleSelectDemoPersona = (persona: (typeof DEMO_PERSONAS)[0]) => {
    login(persona.email, persona.name, persona.profileData);
    setCurrentView('app');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'signin') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both your email address and password.');
        return;
      }
      login(email, fullName || email.split('@')[0]);
      setCurrentView('app');
    } else {
      // Sign up flow
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !password.trim()) {
        setError('Please enter a valid email and password.');
        return;
      }
      // Save preliminary credentials and navigate to onboarding
      login(email, fullName, {
        fullName,
        university: university.trim() || 'Indian Institute of Technology (IIT Delhi)',
      });
      updateProfile({
        fullName,
        university: university.trim() || 'Indian Institute of Technology (IIT Delhi)',
      });
      setCurrentView('onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-[#090b0b] text-[#edf1ec] flex flex-col selection:bg-[#a9f46b] selection:text-[#090b0b]">
      {/* Top Header */}
      <header className="h-16 border-b border-[#222827] bg-[#090b0b]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 text-xs font-mono font-medium text-[#89918c] hover:text-[#edf1ec] transition-colors p-2 rounded-xl hover:bg-[#141818]"
          aria-label="Back to landing page"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#141818] border border-[#222827] flex items-center justify-center text-[#a9f46b]">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-black text-base tracking-tight text-[#edf1ec]">GRANTLY</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-[#141818] border border-[#222827] text-[#89918c] hover:text-[#a9f46b] transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual & Trust Showcase (Hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-[#101313] via-[#141818] to-[#0d1010] border border-[#222827] rounded-3xl relative overflow-hidden shadow-2xl min-h-[580px]">
            {/* Ambient Background Aura */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#a9f46b]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#70b4ff]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141818] border border-[#a9f46b]/30 text-xs font-mono text-[#a9f46b]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STUDENT FINANCIAL EMPOWERMENT</span>
              </div>

              <h2 className="text-3xl font-black text-[#edf1ec] tracking-tight leading-tight">
                Unlock Every Rupee of Financial Assistance You Deserve.
              </h2>

              <p className="text-sm text-[#89918c] leading-relaxed">
                Over 20+ verified government, state, and CSR scholarship schemes mapped to your
                specific academic pedigree, caste reservation, and family income band.
              </p>

              {/* Highlights List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#edf1ec]">
                  <div className="w-5 h-5 rounded-full bg-[#a9f46b]/15 border border-[#a9f46b]/30 flex items-center justify-center text-[#a9f46b] shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>Deterministic FAIE v3.1 Match Accuracy</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#edf1ec]">
                  <div className="w-5 h-5 rounded-full bg-[#a9f46b]/15 border border-[#a9f46b]/30 flex items-center justify-center text-[#a9f46b] shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>Universal Document Vault with Expiry Warnings</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#edf1ec]">
                  <div className="w-5 h-5 rounded-full bg-[#a9f46b]/15 border border-[#a9f46b]/30 flex items-center justify-center text-[#a9f46b] shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>Zero-Loss Deadlines Radar with Urgency Badges</span>
                </div>
              </div>
            </div>

            {/* Testimonial / Trust Card */}
            <div className="mt-8 p-4 rounded-2xl bg-[#090b0b]/60 border border-[#222827] space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-[#a9f46b]">
                <Award className="w-4 h-4" />
                <span>VERIFIED SCHOLAR WIN</span>
              </div>
              <p className="text-xs text-[#89918c] italic leading-relaxed">
                &ldquo;Grantly diagnosed that I was just 2 documents away from qualifying for the
                Reliance Foundation grant. Got ₹2,00,000 sanctioned for my degree.&rdquo;
              </p>
              <span className="text-[10px] font-mono text-[#525c57] block">
                — Aarav S., B.Tech CSE (IIT Delhi)
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Auth Card */}
          <div className="lg:col-span-7 bg-[#101313] border border-[#222827] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex p-1 bg-[#141818] border border-[#222827] rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setError('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  authMode === 'signin'
                    ? 'bg-[#222827] text-[#a9f46b] shadow-xs'
                    : 'text-[#89918c] hover:text-[#edf1ec]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setError('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#222827] text-[#a9f46b] shadow-xs'
                    : 'text-[#89918c] hover:text-[#edf1ec]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* 1-Click Demo Personas for Judges & Evaluators */}
            <div className="space-y-2.5 bg-[#141818]/70 border border-[#222827] p-3.5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-[#a9f46b] text-[10px] flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3 h-3" />
                  1-CLICK JUDGE DEMO PERSONAS
                </span>
                <span className="text-[10px] text-[#525c57] font-mono">Instant Login</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handleSelectDemoPersona(persona)}
                    className="p-2.5 bg-[#101313] hover:bg-[#191e1d] border border-[#222827] hover:border-[#a9f46b]/40 rounded-xl text-left transition-all group"
                  >
                    <div className="font-bold text-xs text-[#edf1ec] group-hover:text-[#a9f46b] truncate">
                      {persona.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#89918c] truncate">
                      {persona.university}
                    </div>
                    <div className="text-[9px] font-mono text-[#525c57] mt-0.5 truncate">
                      {persona.role}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-[#89918c] block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525c57]" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-[#89918c] block">
                      College / University Name
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525c57]" />
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="e.g. IIT Delhi, Anna University, Mumbai University"
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b] transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#89918c] block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525c57]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.ac.in"
                    className="w-full bg-[#141818] border border-[#222827] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-medium text-[#89918c] block">
                    Password
                  </label>
                  {authMode === 'signin' && (
                    <span className="text-[10px] font-mono text-[#70b4ff] hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525c57]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#141818] border border-[#222827] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b] transition-colors"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full btn-mint py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
              >
                <span>
                  {authMode === 'signin' ? 'Sign In to Grantly' : 'Continue to Student Onboarding'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-[#89918c]">
              {authMode === 'signin' ? (
                <span>
                  New to Grantly?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setError('');
                    }}
                    className="text-[#a9f46b] hover:underline font-bold"
                  >
                    Create an account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setError('');
                    }}
                    className="text-[#a9f46b] hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#525c57] pt-2 border-t border-[#222827]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a9f46b]" />
              <span>Encrypted Student Data • 100% Free & Open Access</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
