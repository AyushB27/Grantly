import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  FileText,
  Search,
  Users,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setActiveTab, setIsOnboardingOpen, setIsAuthModalOpen, scholarships } =
    useScholarshipContext();

  const totalCatalogPool = scholarships.reduce((acc, s) => acc + s.amount, 0);

  const handleLaunchApp = (tab?: 'discovery' | 'gaps' | 'vault' | 'tracker') => {
    if (tab) setActiveTab(tab);
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section
        aria-label="Platform Hero Overview"
        className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6"
      >
        {/* Ambient Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#a9f46b]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101313] border border-[#222827] text-xs font-mono shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-[#a9f46b] animate-pulse" />
          <span className="text-[#89918c]">FROM SCHOLARSHIP SEARCH TO SCHOLARSHIP SUCCESS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#edf1ec] tracking-tight leading-[1.12]">
          Higher Education Funding,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a9f46b] via-[#bcfb8b] to-[#7ccb3e]">
            Reimagined for Indian Students.
          </span>
        </h1>

        {/* Value Proposition Description */}
        <p className="text-sm sm:text-base md:text-lg text-[#89918c] max-w-2xl mx-auto leading-relaxed">
          Accessing educational financial aid in India shouldn’t be a maze of fragmented government
          portals and CSR circulars. Grantly matches your verified profile to real schemes, diagnoses
          eligibility gaps, and guides your documents through to the win.
        </p>

        {/* Primary Call-to-Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleLaunchApp('discovery')}
            className="btn-mint px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
          >
            <span>Launch Scholarship Co-Pilot</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="btn-panel px-5 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#a9f46b]" />
            <span>Calibrate My Profile</span>
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn-panel px-5 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 text-[#70b4ff] hover:text-[#edf1ec]"
          >
            <Users className="w-4 h-4" />
            <span>Demo Personas</span>
          </button>
        </div>

        {/* Live Metrics Proof Points */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs font-mono">
          <div className="p-3.5 bg-[#101313] border border-[#222827] rounded-xl text-center space-y-0.5">
            <span className="eyebrow text-[#89918c] block text-[9px]">TOTAL CATALOG POOL</span>
            <span className="text-lg font-bold text-[#a9f46b] block">
              {formatCurrency(totalCatalogPool)}
            </span>
            <span className="text-[10px] text-[#525c57]">Central, State & CSR</span>
          </div>

          <div className="p-3.5 bg-[#101313] border border-[#222827] rounded-xl text-center space-y-0.5">
            <span className="eyebrow text-[#89918c] block text-[9px]">VERIFIED SCHEMES</span>
            <span className="text-lg font-bold text-[#edf1ec] block">20 Official Schemes</span>
            <span className="text-[10px] text-[#525c57]">NSP, Reliance, Tata, PMRF</span>
          </div>

          <div className="p-3.5 bg-[#101313] border border-[#222827] rounded-xl text-center space-y-0.5">
            <span className="eyebrow text-[#89918c] block text-[9px]">ZERO BROKERAGE</span>
            <span className="text-lg font-bold text-[#70b4ff] block">100% Free & Open</span>
            <span className="text-[10px] text-[#525c57]">Private in-browser storage</span>
          </div>
        </div>
      </section>

      {/* 2. How Grantly Solves the 4 Student Pain Points */}
      <section aria-label="How Grantly Works" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="eyebrow text-[#a9f46b]">THE GRANTLY DIFFERENCE</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#edf1ec] tracking-tight">
            How It Works in 4 Guided Steps
          </h2>
          <p className="text-xs sm:text-sm text-[#89918c]">
            Designed around the core principle: <em>Clarity over volume. Confidence over choice.</em>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-5 bg-[#101313] border border-[#222827] rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center font-mono font-bold text-xs text-[#a9f46b]">
              01
            </div>
            <h3 className="font-bold text-sm text-[#edf1ec]">One-Time Smart Profile</h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Enter your course, CGPA, category, and income band once. Grantly remembers it locally so you never refill identical forms.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-[#101313] border border-[#222827] rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center font-mono font-bold text-xs text-[#a9f46b]">
              02
            </div>
            <h3 className="font-bold text-sm text-[#edf1ec]">Match Score & "Why You Match"</h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Every scheme displays a deterministic 0–100% suitability rating and a plain-language sentence explaining why you qualify.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-[#101313] border border-[#222827] rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center font-mono font-bold text-xs text-[#f7ba53]">
              03
            </div>
            <h3 className="font-bold text-sm text-[#edf1ec]">"Almost Eligible" Gap Repair</h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Don't discard near-miss grants. See exactly what is short (e.g. 0.3 CGPA or a missing certificate) plus immediate suggested fixes.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-[#101313] border border-[#222827] rounded-2xl space-y-3 relative">
            <div className="w-8 h-8 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center font-mono font-bold text-xs text-[#70b4ff]">
              04
            </div>
            <h3 className="font-bold text-sm text-[#edf1ec]">Vault & 5-Stage Pipeline</h3>
            <p className="text-xs text-[#89918c] leading-relaxed">
              Store common documents in your universal vault with a live readiness % gauge, and advance applications through outcome confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Signature Features Deep Dive */}
      <section aria-label="Signature Capabilities" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="eyebrow text-[#a9f46b]">SIGNATURE INNOVATIONS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#edf1ec] tracking-tight">
            Built for Real Student Realities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Almost Eligible Gap Analysis */}
          <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[#f7ba53]">FEATURE F4 • SIGNATURE</span>
              <AlertTriangle className="w-5 h-5 text-[#f7ba53]" />
            </div>

            <h3 className="text-lg font-bold text-[#edf1ec]">
              "Almost Eligible" Gap Diagnosis
            </h3>

            <p className="text-xs text-[#89918c] leading-relaxed">
              Students routinely abandon scholarships when they fail a single unclear requirement.
              Grantly highlights near-misses, tells you the exact shortfall (e.g. <em>0.35 CGPA below cutoff</em>),
              and suggests the precise action to fix it or surfaces alternative grants you already qualify for.
            </p>

            <div className="p-3 bg-[#141818] border border-[#222827] rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#f7ba53] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Example: L'Oréal India Science Fellowship (72% Match)</span>
              </div>
              <p className="text-[11px] text-[#89918c]">
                Shortfall: 0.35 CGPA below cutoff • Fix: Target +0.5 SGPA boost next semester or apply for Dr. Reddy's Sashakt Grant (100% Match).
              </p>
            </div>

            <button
              onClick={() => handleLaunchApp('gaps')}
              className="btn-panel px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
            >
              <span>Explore Gap Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Document Vault & Readiness Score */}
          <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[#a9f46b]">FEATURE F5 • SIGNATURE</span>
              <FileText className="w-5 h-5 text-[#a9f46b]" />
            </div>

            <h3 className="text-lg font-bold text-[#edf1ec]">
              Universal Document Vault & Readiness %
            </h3>

            <p className="text-xs text-[#89918c] leading-relaxed">
              Scholarship disqualifications occur primarily due to missing certificates, outdated income
              proofs, or un-seeded bank accounts. Grantly provides a single reusable vault where common
              documents are tracked with a live Application Readiness Score.
            </p>

            <div className="p-3 bg-[#141818] border border-[#222827] rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[#a9f46b] font-bold">Application Readiness: 75% Ready</span>
                <span className="text-[#89918c]">6 of 8 Docs Verified</span>
              </div>
              <p className="text-[11px] text-[#89918c]">
                Aadhaar NPCI-seeded ✓ • Income Certificate (Expiring in 22d ▲) • Bonafide Ready ✓
              </p>
            </div>

            <button
              onClick={() => handleLaunchApp('vault')}
              className="btn-mint px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
            >
              <span>Open Document Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Verified Indian Schemes Preview */}
      <section aria-label="Verified Schemes Catalog Preview" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-[#a9f46b] block">AUTHENTIC SCHEMES</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#edf1ec] tracking-tight">
              Central NSP, State DBT & Premier CSR Foundations
            </h2>
          </div>

          <button
            onClick={() => handleLaunchApp('discovery')}
            className="btn-panel px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>View All 20 Schemes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scholarships.slice(0, 6).map((grant) => (
            <div
              key={grant.id}
              onClick={() => handleLaunchApp('discovery')}
              className="p-4 bg-[#101313] border border-[#222827] hover:border-[#a9f46b] rounded-2xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow text-[#89918c] text-[9px]">{grant.provider}</span>
                <span className="font-mono text-xs font-bold text-[#a9f46b]">
                  {formatCurrency(grant.amount)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#edf1ec] group-hover:text-[#a9f46b] transition-colors line-clamp-1">
                {grant.title}
              </h3>
              <p className="text-[11px] text-[#89918c] line-clamp-2">
                {grant.plainEnglishSummary}
              </p>
              <div className="pt-2 border-t border-[#222827] flex items-center justify-between text-[10px] font-mono text-[#525c57]">
                <span>{grant.effortEstimate}</span>
                <span className="text-[#edf1ec] flex items-center gap-1">
                  View <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Interactive Launch Banner */}
      <section
        aria-label="Get Started Banner"
        className="p-8 sm:p-12 bg-[#101313] border border-[#222827] rounded-3xl text-center space-y-5 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-tr from-[#a9f46b]/10 via-transparent to-[#70b4ff]/5 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-xl mx-auto space-y-3">
          <span className="eyebrow text-[#a9f46b]">GET STARTED NOW</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#edf1ec] tracking-tight">
            Transform Your Scholarship Experience
          </h2>
          <p className="text-xs sm:text-sm text-[#89918c] leading-relaxed">
            No signup barriers. Zero brokerage. Fully offline-capable and stored safely in your browser.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleLaunchApp('discovery')}
              className="btn-mint px-8 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2"
            >
              <span>Explore Scholarship Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-panel px-6 py-3.5 rounded-xl text-sm font-bold"
            >
              <span>Sign In / Demo Persona</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
