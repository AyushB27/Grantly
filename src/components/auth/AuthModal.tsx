import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import {
  User,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
} from 'lucide-react';
import type { StudentProfile } from '../../types/scholarship';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_PERSONAS: {
  id: string;
  name: string;
  email: string;
  role: string;
  cgpa: number;
  category: string;
  profileData: Partial<StudentProfile>;
}[] = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitd.ac.in',
    role: 'B.Tech CSE • 2nd Year (EWS)',
    cgpa: 8.65,
    category: 'General (EWS) • First-Gen',
    profileData: {
      fullName: 'Aarav Sharma',
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
    email: 'ananya.patel@biotech.ac.in',
    role: 'B.Sc / MBBS • 1st Year (STEM Girl Child)',
    cgpa: 9.15,
    category: 'OBC (Non-Creamy) • Single Girl',
    profileData: {
      fullName: 'Ananya Patel',
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
    email: 'rohan.verma@research.iitb.ac.in',
    role: 'M.Tech / Ph.D • PMRF Fellowship Track',
    cgpa: 8.90,
    category: 'SC Category • Research Scholar',
    profileData: {
      fullName: 'Rohan Verma',
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

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, setCurrentView, setIsOnboardingOpen } = useScholarshipContext();

  const [authTab, setAuthTab] = useState<'demo' | 'email'>('demo');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSelectDemo = (persona: typeof DEMO_PERSONAS[0]) => {
    login(persona.email, persona.name, persona.profileData);
    setCurrentView('app');
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    login(email, name || email.split('@')[0]);
    setCurrentView('app');
    onClose();

    if (isRegistering) {
      // Guide new user directly through onboarding
      setIsOnboardingOpen(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Access & Authentication"
      eyebrow="GRANTLY • SECURE SIGN-IN"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#141818] border border-[#222827] rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setAuthTab('demo')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              authTab === 'demo'
                ? 'bg-[#a9f46b] text-[#090b0b]'
                : 'text-[#89918c] hover:text-[#edf1ec]'
            }`}
          >
            Instant Demo Profiles
          </button>
          <button
            type="button"
            onClick={() => setAuthTab('email')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              authTab === 'email'
                ? 'bg-[#a9f46b] text-[#090b0b]'
                : 'text-[#89918c] hover:text-[#edf1ec]'
            }`}
          >
            Email Login / Register
          </button>
        </div>

        {/* Demo Personas Tab */}
        {authTab === 'demo' && (
          <div className="space-y-3">
            <p className="text-xs text-[#89918c] leading-relaxed">
              Select an authentic Indian student persona to immediately test real match scores,
              eligibility gaps, and document checklists:
            </p>

            <div className="space-y-2.5">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleSelectDemo(persona)}
                  className="w-full p-3.5 bg-[#141818] border border-[#222827] hover:border-[#a9f46b] rounded-xl text-left transition-all group flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#edf1ec] group-hover:text-[#a9f46b] transition-colors">
                        {persona.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#a9f46b] bg-[#a9f46b]/10 px-2 py-0.5 rounded border border-[#a9f46b]/20">
                        {persona.cgpa} CGPA
                      </span>
                    </div>
                    <span className="text-xs text-[#89918c] block">{persona.role}</span>
                    <span className="eyebrow text-[#525c57] block text-[9px]">
                      {persona.category}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#89918c] group-hover:text-[#a9f46b] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#101313] border border-[#222827] rounded-xl flex items-center gap-2 text-[11px] text-[#89918c]">
              <ShieldCheck className="w-4 h-4 text-[#a9f46b] shrink-0" />
              <span>Zero server accounts needed. Stored safely in your browser storage.</span>
            </div>
          </div>
        )}

        {/* Email Sign-In / Register Form */}
        {authTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-mono uppercase text-[#89918c] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#89918c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sundaram"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] rounded-xl text-xs text-[#edf1ec] outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-[#89918c] mb-1">
                College / Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#89918c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu.in"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] rounded-xl text-xs text-[#edf1ec] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#89918c] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#89918c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] rounded-xl text-xs text-[#edf1ec] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-mint w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>{isRegistering ? 'Create Account & Begin Onboarding' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 border-t border-[#222827]">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-[#89918c] hover:text-[#a9f46b] transition-colors"
              >
                {isRegistering
                  ? 'Already registered? Sign in instead'
                  : "First time here? Create a free student profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
