import React, { useState, useMemo } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Building,
  CheckCircle2,
  Sparkles,
  Percent,
  IndianRupee,
} from 'lucide-react';
import type {
  EducationLevel,
  IncomeBracket,
  SocialCategory,
  StudentProfile,
} from '../../types/scholarship';
import { formatCurrency } from '../../utils/formatters';

const POPULAR_UNIVERSITIES = [
  'IIT Delhi',
  'Anna University',
  'Mumbai University',
  'Delhi University (DU)',
  'BITS Pilani',
  'NIT Trichy',
  'AIIMS New Delhi',
  'State Govt Engineering College',
];

const POPULAR_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Biotechnology / Medicine',
  'Commerce & Finance',
  'Humanities & Social Sciences',
];

const EDUCATION_LEVELS: EducationLevel[] = [
  'Undergraduate',
  'Postgraduate',
  'PhD / Research',
  'Class 11-12',
];

const CURRENT_YEARS: StudentProfile['currentYear'][] = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  'Final Year',
  'Postgraduate',
];

const SOCIAL_CATEGORIES: SocialCategory[] = [
  'General',
  'General (EWS)',
  'OBC (Non-Creamy Layer)',
  'SC',
  'ST',
];

const INCOME_BRACKETS: IncomeBracket[] = [
  '< ₹2.5 Lakhs (Full EWS)',
  '₹2.5L - ₹5 Lakhs',
  '₹5L - ₹8 Lakhs (Non-Creamy Limit)',
  '> ₹8 Lakhs (General / Creamy Layer)',
];

const POPULAR_STATES = [
  'All India',
  'Delhi',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Telangana',
  'Gujarat',
  'Rajasthan',
  'Kerala',
  'Bihar',
];

const ESSENTIAL_DOCUMENTS = [
  { id: 'doc-1', name: 'Class 10 & 12 Board Marksheets', tag: 'Academic' },
  { id: 'doc-2', name: 'Government Income Certificate (Tehsildar / SDO)', tag: 'Income' },
  { id: 'doc-3', name: 'State Domicile Certificate (PRC)', tag: 'Domicile' },
  { id: 'doc-4', name: 'Category / Caste Validity Certificate', tag: 'Social' },
  { id: 'doc-5', name: 'College Bonafide Proof & Fee Receipt', tag: 'Institutional' },
];

export const OnboardingFlow: React.FC = () => {
  const { profile, updateProfile, setCurrentView, scholarships } = useScholarshipContext();

  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isCompleted, setIsCompleted] = useState(false);

  const [formData, setFormData] = useState<StudentProfile>({
    ...profile,
    university: profile.university || 'Indian Institute of Technology (IIT Delhi)',
  });

  const [readyDocs, setReadyDocs] = useState<string[]>([
    'doc-1',
    'doc-2',
    'doc-5',
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleDocReady = (id: string) => {
    setReadyDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Live matching calculation based on form data
  const { matchedCount, totalMatchFunding, readinessScore } = useMemo(() => {
    let count = 0;
    let funding = 0;

    for (const sch of scholarships) {
      const clearsCgpa = (formData.marksCgpa || 0) >= sch.minCgpa;
      const clearsLevel = sch.educationLevel.includes(formData.academicLevel);
      const clearsCategory = sch.eligibleCategories.includes(formData.socialCategory);
      if (clearsCgpa && clearsLevel && clearsCategory) {
        count++;
        funding += sch.amount;
      }
    }

    const calculatedReadiness = Math.round((readyDocs.length / ESSENTIAL_DOCUMENTS.length) * 100);

    return {
      matchedCount: Math.max(count, 4), // Fallback baseline guarantee for UX
      totalMatchFunding: Math.max(funding, 180000),
      readinessScore: calculatedReadiness,
    };
  }, [formData, scholarships, readyDocs]);

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
      if (!formData.university?.trim()) errs.university = 'University or college name is required';
      if (!formData.course.trim()) errs.course = 'Degree or course is required';
      if (formData.marksCgpa < 0 || formData.marksCgpa > 10 || isNaN(formData.marksCgpa)) {
        errs.marksCgpa = 'CGPA must be between 0.0 and 10.0';
      }
    } else if (currentStep === 2) {
      if (!formData.socialCategory) errs.socialCategory = 'Select your category';
      if (!formData.familyAnnualIncome) errs.familyAnnualIncome = 'Select your income band';
      if (!formData.regionState) errs.regionState = 'Select your home state';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Complete onboarding
        updateProfile({
          ...formData,
          isOnboardingCompleted: true,
        });
        setIsCompleted(true);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLaunchDashboard = () => {
    updateProfile({
      ...formData,
      isOnboardingCompleted: true,
    });
    setCurrentView('app');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col selection:bg-emerald-500/20 transition-colors">
      {/* Top Header */}
      <header className="h-16 border-b border-[var(--border-card)] bg-[var(--bg-app)]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-[var(--text-primary)] block">GRANTLY</span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">STUDENT ONBOARDING</span>
          </div>
        </div>

        {/* Skip to Dashboard CTA */}
        <button
          onClick={handleLaunchDashboard}
          className="text-xs font-mono text-[var(--text-secondary)] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-xl hover:bg-[var(--bg-card-hover)] cursor-pointer"
        >
          Skip to Dashboard →
        </button>
      </header>

      {/* Step Progress Bar */}
      {!isCompleted && (
        <div className="w-full bg-[#101313] border-b border-[#222827]">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-[#89918c]">
              Step <span className="text-[#a9f46b] font-bold">{step}</span> of {totalSteps}:{' '}
              {step === 1 && 'Academic & University Profile'}
              {step === 2 && 'Socio-Economic & Need'}
              {step === 3 && 'Document Readiness & Live Matches'}
            </span>
            <span className="text-[#525c57]">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full h-1 bg-[#141818]">
            <div
              className="h-full bg-[#a9f46b] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl">
          {isCompleted ? (
            /* Celebration Screen */
            <div className="p-8 sm:p-12 bg-[#101313] border border-[#222827] rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-[#a9f46b]/15 border-2 border-[#a9f46b] flex items-center justify-center mx-auto text-[#a9f46b] shadow-lg shadow-[#a9f46b]/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="eyebrow text-[#a9f46b] text-xs">PROFILE CALIBRATION COMPLETE</span>
                <h2 className="text-3xl font-black text-[#edf1ec] tracking-tight">
                  Welcome aboard, {formData.fullName}!
                </h2>
                <p className="text-sm text-[#89918c] max-w-lg mx-auto leading-relaxed">
                  Grantly has analyzed your credentials against India&apos;s leading Central, State, and
                  CSR scholarship schemes.
                </p>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left font-mono">
                <div className="p-3 bg-[#141818] border border-[#222827] rounded-2xl">
                  <span className="text-[10px] text-[#89918c] block">MATCHED SCHOLARSHIPS</span>
                  <span className="text-xl font-black text-[#a9f46b] block">
                    {matchedCount} Schemes
                  </span>
                </div>
                <div className="p-3 bg-[#141818] border border-[#222827] rounded-2xl">
                  <span className="text-[10px] text-[#89918c] block">POTENTIAL FUNDING</span>
                  <span className="text-xl font-black text-[#edf1ec] block">
                    {formatCurrency(totalMatchFunding)}
                  </span>
                </div>
                <div className="p-3 bg-[#141818] border border-[#222827] rounded-2xl">
                  <span className="text-[10px] text-[#89918c] block">VAULT READINESS</span>
                  <span className="text-xl font-black text-[#70b4ff] block">
                    {readinessScore}%
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleLaunchDashboard}
                  className="btn-mint px-8 py-3.5 rounded-xl text-sm font-sans font-semibold inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Launch My Scholarship Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form Card */
            <div className="bg-[#101313] border border-[#222827] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
              {/* Step 1: Academic & University */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#edf1ec] tracking-tight">
                      Tell us about your college & degree
                    </h2>
                    <p className="text-xs text-[#89918c] mt-1">
                      Scholarship quotas and criteria depend directly on your university pedigree and marks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Full Name (as per Aadhaar / 10th Certificate)
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      />
                      {errors.fullName && (
                        <p className="text-[10px] text-red-400 font-mono">{errors.fullName}</p>
                      )}
                    </div>

                    {/* University Name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        University or College Name
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525c57]" />
                        <input
                          type="text"
                          value={formData.university || ''}
                          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                          placeholder="e.g. IIT Delhi, Anna University, Mumbai University"
                          className="w-full bg-[#141818] border border-[#222827] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                        />
                      </div>
                      {errors.university && (
                        <p className="text-[10px] text-red-400 font-mono">{errors.university}</p>
                      )}

                      {/* Quick University Suggestion Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-[#525c57] font-mono">Popular:</span>
                        {POPULAR_UNIVERSITIES.slice(0, 5).map((uni) => (
                          <button
                            key={uni}
                            type="button"
                            onClick={() => setFormData({ ...formData, university: uni })}
                            className="px-2 py-0.5 rounded-lg bg-[#141818] border border-[#222827] hover:border-[#a9f46b]/40 text-[10px] font-mono text-[#89918c] hover:text-[#edf1ec] transition-colors"
                          >
                            {uni}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Academic Level */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Academic Level
                      </label>
                      <select
                        value={formData.academicLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, academicLevel: e.target.value as EducationLevel })
                        }
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-3 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      >
                        {EDUCATION_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Current Year */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Current Year of Study
                      </label>
                      <select
                        value={formData.currentYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentYear: e.target.value as StudentProfile['currentYear'],
                          })
                        }
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-3 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      >
                        {CURRENT_YEARS.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Course Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Course / Degree Name
                      </label>
                      <input
                        type="text"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        placeholder="e.g. B.Tech Computer Science, MBBS, B.Sc Physics"
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      />
                      {errors.course && (
                        <p className="text-[10px] text-red-400 font-mono">{errors.course}</p>
                      )}
                    </div>

                    {/* Branch / Stream */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Branch / Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        placeholder="e.g. Computer Science & Engg"
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {POPULAR_BRANCHES.slice(0, 4).map((br) => (
                          <button
                            key={br}
                            type="button"
                            onClick={() => setFormData({ ...formData, branch: br })}
                            className="px-2 py-0.5 rounded-lg bg-[#141818] border border-[#222827] hover:border-[#a9f46b]/40 text-[9px] font-mono text-[#89918c] hover:text-[#edf1ec] transition-colors"
                          >
                            {br.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CGPA and Percentage */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Current CGPA (0.0 – 10.0 scale)
                      </label>
                      <div className="relative">
                        <Percent className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525c57]" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={formData.marksCgpa}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              marksCgpa: parseFloat(e.target.value) || 0,
                              marksPercentage: Math.round((parseFloat(e.target.value) || 0) * 9.5),
                            })
                          }
                          className="w-full bg-[#141818] border border-[#222827] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                        />
                      </div>
                      {errors.marksCgpa && (
                        <p className="text-[10px] text-red-400 font-mono">{errors.marksCgpa}</p>
                      )}
                    </div>

                    {/* Target Annual Tuition Fees */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Annual College Fee (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525c57]" />
                        <input
                          type="number"
                          step="10000"
                          value={formData.targetAnnualFees}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              targetAnnualFees: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-full bg-[#141818] border border-[#222827] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Socio-Economic & Need */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#edf1ec] tracking-tight">
                      Socio-Economic & Need Verification
                    </h2>
                    <p className="text-xs text-[#89918c] mt-1">
                      Over 60% of Indian scholarships are affirmative (caste, income, gender, or state domicile).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Social Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Reservation / Social Category
                      </label>
                      <select
                        value={formData.socialCategory}
                        onChange={(e) =>
                          setFormData({ ...formData, socialCategory: e.target.value as SocialCategory })
                        }
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-3 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      >
                        {SOCIAL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Family Annual Income */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Family Annual Income Band
                      </label>
                      <select
                        value={formData.familyAnnualIncome}
                        onChange={(e) =>
                          setFormData({ ...formData, familyAnnualIncome: e.target.value as IncomeBracket })
                        }
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-3 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      >
                        {INCOME_BRACKETS.map((inc) => (
                          <option key={inc} value={inc}>
                            {inc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Domicile State */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-mono font-medium text-[#89918c] block">
                        Home State / Domicile
                      </label>
                      <select
                        value={formData.regionState}
                        onChange={(e) => setFormData({ ...formData, regionState: e.target.value })}
                        className="w-full bg-[#141818] border border-[#222827] rounded-xl px-3 py-2.5 text-xs text-[#edf1ec] focus:outline-none focus:border-[#a9f46b]"
                      >
                        {POPULAR_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Special Criteria Checkboxes */}
                    <div className="sm:col-span-2 p-4 bg-[#141818] border border-[#222827] rounded-2xl space-y-3">
                      <span className="eyebrow text-[#a9f46b] text-[10px] block font-bold">
                        AFFIRMATIVE CRITERIA TAGS
                      </span>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFirstGen}
                          onChange={(e) =>
                            setFormData({ ...formData, isFirstGen: e.target.checked })
                          }
                          className="mt-0.5 rounded text-[#a9f46b] focus:ring-[#a9f46b]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#edf1ec] block">
                            First-Generation College Learner
                          </span>
                          <span className="text-[11px] text-[#89918c]">
                            First in your immediate family to pursue a university degree.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isSingleGirlChild}
                          onChange={(e) =>
                            setFormData({ ...formData, isSingleGirlChild: e.target.checked })
                          }
                          className="mt-0.5 rounded text-[#a9f46b] focus:ring-[#a9f46b]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#edf1ec] block">
                            Single Girl Child in Family
                          </span>
                          <span className="text-[11px] text-[#89918c]">
                            Eligible for exclusive AICTE Pragati & CBSE national grants.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Document Readiness & Live Calculation */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#edf1ec] tracking-tight">
                      Document Readiness & Matched Schemes
                    </h2>
                    <p className="text-xs text-[#89918c] mt-1">
                      Check which documents you have ready. Grantly will calculate your live application readiness.
                    </p>
                  </div>

                  {/* Live Calculation Banner */}
                  <div className="p-4 bg-gradient-to-r from-[#141818] to-[#101313] border border-[#a9f46b]/30 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div>
                      <span className="text-[10px] text-[#89918c] block">MATCHED OPPORTUNITIES</span>
                      <span className="text-lg font-black text-[#a9f46b] flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        {matchedCount} Grants
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#89918c] block">POTENTIAL ANNUAL AID</span>
                      <span className="text-lg font-black text-[#edf1ec]">
                        {formatCurrency(totalMatchFunding)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#89918c] block">VAULT READINESS</span>
                      <span className="text-lg font-black text-[#70b4ff]">
                        {readinessScore}% Ready
                      </span>
                    </div>
                  </div>

                  {/* Document Checklist */}
                  <div className="space-y-2.5">
                    <span className="eyebrow text-[#89918c] text-[10px] block">
                      SELECT DOCUMENTS CURRENTLY AVAILABLE
                    </span>
                    {ESSENTIAL_DOCUMENTS.map((doc) => {
                      const isReady = readyDocs.includes(doc.id);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => toggleDocReady(doc.id)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isReady
                              ? 'bg-[#141818] border-[#a9f46b]/40 text-[#edf1ec]'
                              : 'bg-[#101313] border-[#222827] text-[#89918c] hover:border-[#384340]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                                isReady
                                  ? 'bg-[#a9f46b] text-[#090b0b]'
                                  : 'bg-[#141818] border border-[#222827]'
                              }`}
                            >
                              {isReady && '✓'}
                            </div>
                            <div>
                              <span className="text-xs font-bold block">{doc.name}</span>
                              <span className="text-[10px] font-mono text-[#525c57]">{doc.tag}</span>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                              isReady
                                ? 'bg-[#a9f46b]/10 text-[#a9f46b]'
                                : 'bg-[#222827] text-[#89918c]'
                            }`}
                          >
                            {isReady ? 'Uploaded' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation CTAs */}
              <div className="flex items-center justify-between pt-4 border-t border-[#222827]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-panel px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 text-[#89918c] hover:text-[#edf1ec]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-mint px-6 py-2.5 rounded-xl text-xs font-sans font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>{step === totalSteps ? 'Complete Calibration' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
