import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Sun,
  Moon,
  TrendingUp,
  FileCheck,
  Search,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const PREVIEW_SCHOLARSHIPS = [
  {
    id: 'rel-preview',
    title: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation CSR',
    amount: 200000,
    match: 94,
    deadline: 'Closing in 12 days',
    tag: 'Engineering / STEM',
    badge: 'CSR Foundation',
  },
  {
    id: 'nsp-preview',
    title: 'Central Sector Scheme for College Students (NSP)',
    provider: 'Dept of Higher Education (MHRD)',
    amount: 20000,
    match: 88,
    deadline: 'Closing in 18 days',
    tag: 'Merit-cum-Means',
    badge: 'Central Govt (NSP)',
  },
  {
    id: 'pragati-preview',
    title: 'AICTE Pragati Scholarship Scheme for Girls',
    provider: 'AICTE Govt of India',
    amount: 50000,
    match: 96,
    deadline: 'Closing in 24 days',
    tag: 'Women in Tech',
    badge: 'Govt of India',
  },
  {
    id: 'hdfc-preview',
    title: 'HDFC Bank Parivartan’s ECSS Support',
    provider: 'HDFC Bank CSR',
    amount: 75000,
    match: 82,
    deadline: 'Closing in 30 days',
    tag: 'Crisis / Need-Based',
    badge: 'CSR Foundation',
  },
];

export const LandingPage: React.FC = () => {
  const { setCurrentView, scholarships, theme, toggleTheme } = useScholarshipContext();

  const totalCatalogPool = scholarships.reduce((acc, s) => acc + s.amount, 0);

  const handleGoToAuth = () => {
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090b0b] text-[#edf1ec] flex flex-col selection:bg-[#a9f46b] selection:text-[#090b0b] overflow-x-hidden">
      {/* 1. Standalone Minimalist Landing Header (NO APP NAVBAR, NO TABS) */}
      <header className="sticky top-0 z-50 h-18 border-b border-[#222827] bg-[#090b0b]/90 backdrop-blur-md px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center text-[#a9f46b] shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight text-[#edf1ec] block leading-tight">
                GRANTLY
              </span>
              <span className="eyebrow text-[#a9f46b] block text-[9px]">
                SCHOLARSHIP CO-PILOT
              </span>
            </div>
          </div>

          {/* Right Action Controls: Theme Switcher & Single Login/Sign Up Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[#101313] border border-[#222827] text-[#89918c] hover:text-[#a9f46b] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleGoToAuth}
              className="btn-mint px-5 py-2.5 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-2 shadow-lg hover:shadow-[#a9f46b]/20 transition-all cursor-pointer"
            >
              <span>Login / Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-8">
        {/* Ambient Glow Orbs */}
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#a9f46b]/15 via-[#a9f46b]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Headlines */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101313] border border-[#222827] text-xs font-mono shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#a9f46b] animate-ping" />
              <span className="text-[#a9f46b] font-bold">FAIE v3.1 ALIGNED</span>
              <span className="text-[#525c57]">•</span>
              <span className="text-[#89918c]">INDIAN SCHOLARSHIP ECOSYSTEM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#edf1ec] tracking-tight leading-[1.12]">
              Rethinking Educational Aid for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a9f46b] via-[#bcfb8b] to-[#7ccb3e]">
                Indian Students.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#89918c] max-w-2xl mx-auto leading-relaxed">
              From scholarship search to scholarship success. Clarity over volume. Confidence over
              choice. Grantly matches your verified profile to real schemes, diagnoses qualification
              gaps, and secures your documents.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleGoToAuth}
                className="btn-mint px-7 py-3.5 rounded-2xl text-sm font-mono font-bold inline-flex items-center gap-2.5 shadow-xl hover:shadow-[#a9f46b]/25 transition-all cursor-pointer"
              >
                <span>Check Your Eligibility Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleGoToAuth}
                className="btn-panel px-6 py-3.5 rounded-2xl text-sm font-mono font-bold inline-flex items-center gap-2 text-[#70b4ff] hover:text-[#edf1ec] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#70b4ff]" />
                <span>Explore 1-Click Demo</span>
              </button>
            </div>
          </div>

          {/* 3. Hero Visual Centerpiece: Animated Interactive Live Eligibility Scanner */}
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#141818] to-[#0d1010] border border-[#222827] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Animated Laser Scan Beam */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#a9f46b] to-transparent opacity-60 animate-pulse pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#222827]">
              {/* Student Pedigree Badge */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#a9f46b]/10 border border-[#a9f46b]/30 flex items-center justify-center text-[#a9f46b] font-black text-lg">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#edf1ec]">Aarav Sharma</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#101313] border border-[#222827] text-[10px] font-mono text-[#a9f46b]">
                      Verified Scholar
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#89918c]">
                    B.Tech CSE • 2nd Year • IIT Delhi (EWS Quota)
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#101313] border border-[#222827] text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#a9f46b] animate-ping" />
                <span className="text-[#a9f46b]">LIVE SCANNER ACTIVE</span>
              </div>
            </div>

            {/* Interactive Card Body: Live Grant Match Preview */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Match Dial & Score */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-[#101313] border border-[#222827] rounded-2xl text-center space-y-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#1e2423]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#a9f46b]"
                      strokeDasharray="94, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[#edf1ec] font-mono leading-none">
                      94%
                    </span>
                    <span className="text-[9px] font-mono text-[#a9f46b] mt-0.5">MATCH</span>
                  </div>
                </div>
                <span className="eyebrow text-[#89918c] text-[10px]">RELIANCE FOUNDATION CSR</span>
              </div>

              {/* Matched Details & Criteria Verification */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-[#edf1ec]">
                      Reliance Foundation Undergraduate Scholarship
                    </h3>
                    <span className="text-sm font-black font-mono text-[#a9f46b]">
                      ₹2,00,000 Total
                    </span>
                  </div>
                  <p className="text-xs text-[#89918c] leading-relaxed">
                    Provides annual tuition funding across all 4 years of engineering degree.
                  </p>
                </div>

                {/* Criteria Checked Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 p-2 bg-[#101313] border border-[#222827] rounded-xl text-[#edf1ec]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a9f46b]" />
                    <span>CGPA 8.65 &gt;= 7.5 Cutoff</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#101313] border border-[#222827] rounded-xl text-[#edf1ec]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a9f46b]" />
                    <span>Family Income &lt; ₹15L Cap</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#101313] border border-[#222827] rounded-xl text-[#edf1ec]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a9f46b]" />
                    <span>Class 12 Marksheet in Vault</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#101313] border border-[#222827] rounded-xl text-[#edf1ec]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a9f46b]" />
                    <span>Income Certificate Verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-mono text-[#525c57]">
                    Official Portal: scholarships.reliancefoundation.org
                  </span>
                  <button
                    onClick={handleGoToAuth}
                    className="text-xs font-mono font-bold text-[#a9f46b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Scholarship Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Metrics Proof Bar */}
      <section className="border-y border-[#222827] bg-[#101313]/50 py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center font-mono">
          <div className="space-y-1">
            <span className="eyebrow text-[#89918c] text-[10px] block">TOTAL FUNDING POOL</span>
            <span className="text-2xl sm:text-3xl font-black text-[#a9f46b] block">
              {formatCurrency(totalCatalogPool)}
            </span>
            <span className="text-[11px] text-[#525c57]">Central, State & CSR</span>
          </div>

          <div className="space-y-1">
            <span className="eyebrow text-[#89918c] text-[10px] block">VERIFIED SCHEMES</span>
            <span className="text-2xl sm:text-3xl font-black text-[#edf1ec] block">
              20 Schemes
            </span>
            <span className="text-[11px] text-[#525c57]">NSP, Reliance, Tata, PMRF</span>
          </div>

          <div className="space-y-1">
            <span className="eyebrow text-[#89918c] text-[10px] block">MATCH ACCURACY</span>
            <span className="text-2xl sm:text-3xl font-black text-[#70b4ff] block">
              100% Deterministic
            </span>
            <span className="text-[11px] text-[#525c57]">FAIE v3.1 Engine</span>
          </div>

          <div className="space-y-1">
            <span className="eyebrow text-[#89918c] text-[10px] block">ZERO SPAM / FEES</span>
            <span className="text-2xl sm:text-3xl font-black text-[#a9f46b] block">
              ₹0 Cost
            </span>
            <span className="text-[11px] text-[#525c57]">Free & Open for All Students</span>
          </div>
        </div>
      </section>

      {/* 5. 4 Core Pillars of Grantly (Bento Grid) */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="eyebrow text-[#a9f46b] text-xs font-bold">THE GRANTLY ADVANTAGE</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#edf1ec] tracking-tight">
            Built to Overcome Every Barrier in Indian Higher Ed Funding
          </h2>
          <p className="text-sm text-[#89918c]">
            Students don’t miss scholarships because they lack merit. They miss them because the
            journey is fragmented, opaque, and intimidating.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Instant Match % */}
          <div className="p-6 bg-[#101313] border border-[#222827] rounded-3xl space-y-4 hover:border-[#a9f46b]/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#a9f46b]/10 border border-[#a9f46b]/20 flex items-center justify-center text-[#a9f46b]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#edf1ec]">Personalized Match %</h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Never read a 50-page official PDF again. Grantly evaluates your CGPA, family income,
              and state quota to give you an instant transparent match score with an explicit
              &ldquo;Why You Match&rdquo; rationale.
            </p>
          </div>

          {/* Card 2: "Almost Eligible" Gap Analysis (Signature Feature) */}
          <div className="p-6 bg-[#101313] border border-[#222827] rounded-3xl space-y-4 hover:border-[#70b4ff]/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#70b4ff]/10 border border-[#70b4ff]/20 flex items-center justify-center text-[#70b4ff]">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#edf1ec]">
              &ldquo;Almost Eligible&rdquo; Gap Analysis
            </h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Don’t get disqualified silently. For near-miss opportunities, Grantly pinpoints
              the exact shortfall—whether it is 4% marks or a missing domicile certificate—and gives
              you the remedy before deadlines expire.
            </p>
          </div>

          {/* Card 3: Universal Document Vault */}
          <div className="p-6 bg-[#101313] border border-[#222827] rounded-3xl space-y-4 hover:border-[#a9f46b]/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#a9f46b]/10 border border-[#a9f46b]/20 flex items-center justify-center text-[#a9f46b]">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#edf1ec]">Universal Document Vault</h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Organize marksheets, income proof, and bonafide letters once. Live readiness tracking
              alerts you to expiring certificates so your applications are 100% submission-ready.
            </p>
          </div>

          {/* Card 4: 5-Stage Kanban Application Tracker */}
          <div className="p-6 bg-[#101313] border border-[#222827] rounded-3xl space-y-4 md:col-span-2 lg:col-span-2 hover:border-[#a9f46b]/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#a9f46b]/10 border border-[#a9f46b]/20 flex items-center justify-center text-[#a9f46b]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#edf1ec]">
              5-Stage Kanban Tracker & Deadlines Radar
            </h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Move seamlessly from Saved → Preparing → Submitted → Under Review → Awarded.
              Integrated with urgency radar warnings (&ldquo;3 days left&rdquo;, &ldquo;Due this
              week&rdquo;) so no opportunity slips away.
            </p>
          </div>

          {/* Card 5: Multi-Scholarship Stack Planner */}
          <div className="p-6 bg-[#101313] border border-[#222827] rounded-3xl space-y-4 hover:border-[#70b4ff]/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#70b4ff]/10 border border-[#70b4ff]/20 flex items-center justify-center text-[#70b4ff]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#edf1ec]">Scholarship Stack Planner</h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Combine compatible scholarships, detect official government conflicts, and calculate
              your total net tuition gap in one unified dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Featured Official Indian Schemes */}
      <section className="py-16 px-4 sm:px-8 border-t border-[#222827] bg-[#101313]/30">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-[#a9f46b] text-xs font-bold">VERIFIED SCHOLARSHIPS</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#edf1ec] tracking-tight mt-1">
                Explore Schemes in the Active Catalog
              </h2>
            </div>
            <button
              onClick={handleGoToAuth}
              className="text-xs font-mono font-bold text-[#a9f46b] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All 20 Verified Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PREVIEW_SCHOLARSHIPS.map((scheme) => (
              <div
                key={scheme.id}
                onClick={handleGoToAuth}
                className="p-5 bg-[#101313] border border-[#222827] hover:border-[#a9f46b]/40 rounded-2xl space-y-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded-md bg-[#141818] border border-[#222827] text-[#89918c]">
                    {scheme.badge}
                  </span>
                  <span className="font-bold text-[#a9f46b]">{scheme.match}% Match</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#edf1ec] group-hover:text-[#a9f46b] transition-colors line-clamp-2">
                    {scheme.title}
                  </h4>
                  <span className="text-[11px] text-[#89918c] block">{scheme.provider}</span>
                </div>

                <div className="pt-2 border-t border-[#222827] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#525c57] block">AWARD VALUE</span>
                    <span className="text-sm font-black font-mono text-[#edf1ec]">
                      {formatCurrency(scheme.amount)}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#fcd34d] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {scheme.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom Conversion Banner */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#141818] via-[#161c1b] to-[#101313] border border-[#a9f46b]/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#a9f46b]/15 border border-[#a9f46b]/30 flex items-center justify-center mx-auto text-[#a9f46b]">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-[#edf1ec] tracking-tight">
              Ready to Secure Your Educational Funding?
            </h2>
            <p className="text-sm text-[#89918c] leading-relaxed">
              Create your student profile in 2 minutes, get matched to scholarships you can actually
              win, and track every deadline with certainty.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleGoToAuth}
              className="btn-mint px-8 py-3.5 rounded-2xl text-sm font-mono font-bold inline-flex items-center gap-2 shadow-xl hover:shadow-[#a9f46b]/25 transition-all cursor-pointer"
            >
              <span>Get Started Now — It&apos;s Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#525c57] pt-4">
            <ShieldCheck className="w-4 h-4 text-[#a9f46b]" />
            <span>Built for First-Generation, Tier-1, Tier-2, and Tier-3 Indian Scholars</span>
          </div>
        </div>
      </section>
    </div>
  );
};
