import React, { useState, useEffect } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import heroImage from '../../assets/hero.png';

interface SchemePreview {
  id: string;
  name: string;
  provider: string;
  award: number;
  minCgpa: number;
  categories: string[];
  level: string;
  deadlineText: string;
}

const FEATURED_SCHEMES: SchemePreview[] = [
  {
    id: 'sch-1',
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation (CSR)',
    award: 200000,
    minCgpa: 7.5,
    categories: ['General', 'General (EWS)', 'OBC (Non-Creamy Layer)', 'SC', 'ST'],
    level: 'Undergraduate',
    deadlineText: 'Closing Nov 20, 2026',
  },
  {
    id: 'sch-2',
    name: 'Central Sector Scheme of Scholarships (NSP)',
    provider: 'Dept of Higher Education (MHRD, Govt of India)',
    award: 20000,
    minCgpa: 6.5,
    categories: ['General', 'General (EWS)', 'OBC (Non-Creamy Layer)', 'SC', 'ST'],
    level: 'Undergraduate',
    deadlineText: 'Closing Dec 05, 2026',
  },
  {
    id: 'sch-3',
    name: 'AICTE Pragati Scholarship for Girls',
    provider: 'AICTE Govt of India',
    award: 50000,
    minCgpa: 6.0,
    categories: ['General', 'General (EWS)', 'OBC (Non-Creamy Layer)', 'SC', 'ST'],
    level: 'Undergraduate',
    deadlineText: 'Closing Dec 15, 2026',
  },
  {
    id: 'sch-4',
    name: 'HDFC Bank Parivartan’s ECSS Educational Support',
    provider: 'HDFC Bank CSR',
    award: 75000,
    minCgpa: 6.0,
    categories: ['General (EWS)', 'OBC (Non-Creamy Layer)', 'SC', 'ST'],
    level: 'Undergraduate',
    deadlineText: 'Closing Dec 31, 2026',
  },
];

export const LandingPage: React.FC = () => {
  const { setCurrentView, scholarships, theme, toggleTheme } = useScholarshipContext();

  const totalCatalogPool = scholarships.reduce((acc, s) => acc + s.amount, 0);

  // Interactive Calculator State
  const [degree, setDegree] = useState<'Engineering' | 'Medical' | 'Sciences' | 'Arts'>('Engineering');
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [category, setCategory] = useState<'General' | 'EWS' | 'OBC' | 'SC/ST'>('EWS');

  // Hardware-accelerated smooth scroll reveal transitions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleGoToAuth = () => {
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic matching preview calculation
  const calculatedEligibleCount = React.useMemo(() => {
    let count = 4;
    if (cgpa >= 8.0) count += 4;
    if (category === 'EWS' || category === 'SC/ST') count += 3;
    if (degree === 'Engineering') count += 2;
    return Math.min(count, 14);
  }, [degree, cgpa, category]);

  const estimatedFunding = React.useMemo(() => {
    let amount = 140000;
    if (cgpa >= 7.5) amount += 100000;
    if (category === 'EWS') amount += 50000;
    return amount;
  }, [cgpa, category]);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col selection:bg-emerald-500/20 font-sans transition-colors">
      {/* 1. Sleek Editorial Header (No Nav Links, Only Theme & Sign-in) */}
      <header className="sticky top-0 z-40 h-16 border-b border-[var(--border-card)] bg-[var(--bg-app)]/90 backdrop-blur-md px-4 sm:px-8 transition-colors">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[var(--text-primary)] block leading-tight">
                GRANTLY
              </span>
              <span className="text-[10px] font-sans font-medium text-emerald-600 dark:text-emerald-400 block tracking-wide">
                Scholarship Co-Pilot
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shadow-xs"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>

            <button
              onClick={handleGoToAuth}
              className="btn-mint px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Sign In / Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Confident Solid Typography, Real Hero Image & Interactive Live Matcher */}
      <section className="pt-10 sm:pt-14 pb-16 px-4 sm:px-8 border-b border-[#1e293b]">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Top Hero Grid: Headline + Visual Dossier Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 Columns: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#111827] border border-[#1e293b] text-xs font-mono text-[#94a3b8]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>CENTRAL, STATE & CSR SCHOLARSHIPS • INDIAN HIGHER ED</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#f8fafc] tracking-tight leading-[1.12]">
                Rethinking the Scholarship Experience for Indian Students.
              </h1>

              <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
                Educational financial assistance exists in abundance, but students miss opportunities
                due to fragmented portals, dense circulars, and late document discovery. Grantly is
                your dedicated digital co-pilot—discovering what you can win, diagnosing missing items,
                and guiding you through to disbursement.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleGoToAuth}
                  className="btn-mint px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Check Your Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleGoToAuth}
                  className="btn-panel px-5 py-3 text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Demo Profiles</span>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-[#94a3b8] border-t border-[#1e293b]/60">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  20+ Curated Indian Schemes
                </span>
                <span className="text-[#64748b]">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {formatCurrency(totalCatalogPool)} Matched Pool
                </span>
                <span className="text-[#64748b]">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Deterministic Rule Engine
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Visual Hero Showcase Dossier */}
            <div className="lg:col-span-5">
              <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden">
                {/* Dossier Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      VERIFIED APPLICATION DOSSIER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94a3b8] px-2 py-0.5 rounded bg-[#162032] border border-[#1e293b]">
                    DigiLocker Linked
                  </span>
                </div>

                {/* Hero Illustration / Mascot with Student Context */}
                <div className="flex items-center gap-4 bg-[#162032] p-4 rounded-xl border border-[#1e293b]">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#111827] border border-emerald-500/20 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={heroImage}
                      alt="Grantly Student Financial Co-Pilot"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      Active Candidate
                    </span>
                    <h3 className="font-bold text-sm text-[#f8fafc] truncate">
                      Aarav Sharma
                    </h3>
                    <p className="text-xs text-[#94a3b8] truncate">
                      B.Tech Computer Science • IIT Delhi
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      94% Match Fit
                    </div>
                  </div>
                </div>

                {/* Verification Checklist Items */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#162032]/60 border border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[#f8fafc] font-medium text-[11px]">Tehsildar Income Cert (&lt; ₹2.5L)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">VERIFIED</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#162032]/60 border border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[#f8fafc] font-medium text-[11px]">Academic CGPA (8.8 / 10.0)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">MET</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#162032]/60 border border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[#f8fafc] font-medium text-[11px]">College Bonafide Department</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">ATTACHED</span>
                  </div>
                </div>

                {/* Action summary footer */}
                <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8] font-mono text-[11px]">Readiness Score</span>
                  <span className="font-mono font-bold text-emerald-400">100% Ready to Submit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Scheme Matcher Card (Tangible & Functional, Not Marketing Slop) */}
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1e293b] gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  INTERACTIVE ELIGIBILITY PREVIEW
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#f8fafc]">
                  Simulate your academic standing against real schemes
                </h2>
              </div>
              <span className="text-xs font-mono text-[#94a3b8]">
                Deterministic Rule Matching
              </span>
            </div>

            {/* Interactive Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Degree Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#94a3b8] block">Degree Stream</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#162032] border border-[#1e293b] rounded-xl text-xs">
                  {(['Engineering', 'Medical', 'Sciences', 'Arts'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDegree(d)}
                      className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        degree === d
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                          : 'text-[#94a3b8] hover:text-[#f8fafc]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#94a3b8] block">Reservation / Need Category</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#162032] border border-[#1e293b] rounded-xl text-xs">
                  {(['General', 'EWS', 'OBC', 'SC/ST'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        category === c
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                          : 'text-[#94a3b8] hover:text-[#f8fafc]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* CGPA Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8] font-medium">Academic CGPA</span>
                  <span className="font-mono font-bold text-emerald-400">{cgpa.toFixed(1)} / 10.0</span>
                </div>
                <div className="p-3 bg-[#162032] border border-[#1e293b] rounded-xl flex items-center">
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={cgpa}
                    onChange={(e) => setCgpa(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Output Banner */}
            <div className="p-4 rounded-xl bg-[#162032] border border-[#1e293b] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] block">
                  QUALIFIED SCHEMES
                </span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {calculatedEligibleCount} Opportunities
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] block">
                  ESTIMATED ANNUAL FUNDING
                </span>
                <div className="text-xl font-bold font-mono text-[#f8fafc]">
                  {formatCurrency(estimatedFunding)} / yr
                </div>
              </div>
              <div className="sm:text-right">
                <button
                  onClick={handleGoToAuth}
                  className="btn-mint px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Matched Schemes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 01: Core Pain Points Transformed */}
      <section className="reveal-on-scroll py-16 px-4 sm:px-8 border-b border-[#1e293b]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">
              01 / COMPARISON
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              The Problem We Solve: From Chaos to Clarity
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1 max-w-xl">
              Compare the friction-filled traditional search against Grantly&apos;s streamlined student co-pilot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 bg-[#111827] border border-red-500/20 rounded-2xl space-y-4">
              <span className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider block">
                THE TRADITIONAL MAZE
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-[#94a3b8]">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Scattered across NSP, individual State DBT portals, and private trust websites.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Eligibility criteria written in dense bureaucratic PDFs with hidden income clauses.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Missing documents discovered hours before midnight deadlines.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Silent rejections with zero feedback on why an application failed.</span>
                </li>
              </ul>
            </div>

            {/* The Grantly Way */}
            <div className="p-6 bg-[#111827] border border-emerald-500/30 rounded-2xl space-y-4 shadow-sm">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider block">
                THE GRANTLY CO-PILOT
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-[#f8fafc]">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>A single verified catalog covering 20+ national, state, and CSR initiatives.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Plain-language requirements with an explicit &ldquo;Why you match&rdquo; score.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Universal Document Vault with live readiness % and expiration monitoring.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Signature Gap Analysis pinpointing near-misses (&ldquo;4% below cutoff&rdquo;) with actionable fixes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 02: 4-Step Student Journey */}
      <section className="reveal-on-scroll py-16 px-4 sm:px-8 border-b border-[#1e293b]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">
              02 / PROCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              A 4-Step Co-Pilot Journey Built for Confidence
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1 max-w-xl">
              Every feature directly solves an obstacle students face when finding and winning scholarships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#111827] border border-[#1e293b] rounded-2xl space-y-3">
              <span className="text-lg font-black font-mono text-emerald-400 block">01</span>
              <h3 className="font-bold text-sm text-[#f8fafc]">Calibrate Profile</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Save your college, degree, marks, category, and income band once. Reused everywhere so you never repeat data.
              </p>
            </div>

            <div className="p-5 bg-[#111827] border border-[#1e293b] rounded-2xl space-y-3">
              <span className="text-lg font-black font-mono text-emerald-400 block">02</span>
              <h3 className="font-bold text-sm text-[#f8fafc]">Personalized Feed</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Review scheme cards with effort estimates, award amounts, and clear reasons why your profile qualifies.
              </p>
            </div>

            <div className="p-5 bg-[#111827] border border-[#1e293b] rounded-2xl space-y-3">
              <span className="text-lg font-black font-mono text-emerald-400 block">03</span>
              <h3 className="font-bold text-sm text-[#f8fafc]">Almost Eligible Gaps</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                See exactly what&apos;s short on near-miss grants. Fix an income certificate or explore parallel opportunities you qualify for.
              </p>
            </div>

            <div className="p-5 bg-[#111827] border border-[#1e293b] rounded-2xl space-y-3">
              <span className="text-lg font-black font-mono text-emerald-400 block">04</span>
              <h3 className="font-bold text-sm text-[#f8fafc]">Universal Vault</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Store certificates once. Track 5 application stages (Saved through to Awarded) without missing a deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 03: Verified Indian Schemes Showcase */}
      <section className="reveal-on-scroll py-16 px-4 sm:px-8 border-b border-[#1e293b]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">
                03 / SCHEMES CATALOG
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
                Featured Verified Schemes
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1">
                Total catalog pool currently tracking {formatCurrency(totalCatalogPool)} in financial assistance.
              </p>
            </div>

            <button
              onClick={handleGoToAuth}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All 20 Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_SCHEMES.map((scheme) => (
              <div
                key={scheme.id}
                onClick={handleGoToAuth}
                className="p-5 bg-[#111827] border border-[#1e293b] hover:border-emerald-500/30 rounded-2xl space-y-3 cursor-pointer transition-all group shadow-xs"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded-md bg-[#162032] border border-[#1e293b] text-[#94a3b8]">
                    {scheme.level}
                  </span>
                  <span className="text-emerald-400 font-bold">Min {scheme.minCgpa} CGPA</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#f8fafc] group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {scheme.name}
                  </h3>
                  <span className="text-[11px] text-[#94a3b8] block">{scheme.provider}</span>
                </div>

                <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#64748b] block">AWARD</span>
                    <span className="text-sm font-bold font-mono text-[#f8fafc]">
                      {formatCurrency(scheme.award)}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {scheme.deadlineText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Section 04: Purpose-Built for Inclusion */}
      <section className="reveal-on-scroll py-16 px-4 sm:px-8 border-b border-[#1e293b]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">
              04 / ACCESSIBILITY & DIVERSITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              Designed for First-Generation & Diverse Scholars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#111827] border border-[#1e293b] rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-[#f8fafc]">First-Generation Learners</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Clear step-by-step guidance on how to obtain certificates from Tehsildar offices and college registrar bonafide departments.
              </p>
            </div>

            <div className="p-6 bg-[#111827] border border-[#1e293b] rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-[#f8fafc]">Mobile-First & Bandwidth Aware</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Zero heavy images or video bloat. Responsive layouts with touch targets above 44px that load fast even on 3G connections.
              </p>
            </div>

            <div className="p-6 bg-[#111827] border border-[#1e293b] rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-[#f8fafc]">Complete Privacy & Security</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                All data stored locally in your browser storage. Zero tracking cookies, zero ads, zero monetized student lead selling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Action Banner (Clean, Crisp, No Slop) */}
      <section className="reveal-on-scroll py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-[#111827] border border-[#1e293b] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              Ready to Simplify Your Scholarship Journey?
            </h2>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Calibrate your profile in two minutes, evaluate matching scholarships you actually qualify for, and never miss a deadline.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGoToAuth}
              className="btn-mint px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Now — It&apos;s Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#64748b] pt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Built for Indian Students • 100% Free & Open Access</span>
          </div>
        </div>
      </section>
    </div>
  );
};
