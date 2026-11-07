import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type {
  EducationLevel,
  IncomeBracket,
  SocialCategory,
  StudentProfile,
} from '../../types/scholarship';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  'Madhya Pradesh',
  'Punjab',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useScholarshipContext();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.course.trim()) newErrors.course = 'Course title is required';
      if (!formData.branch.trim()) newErrors.branch = 'Specialization / branch is required';
    } else if (currentStep === 2) {
      if (formData.marksCgpa < 0 || formData.marksCgpa > 10 || isNaN(formData.marksCgpa)) {
        newErrors.marksCgpa = 'CGPA must be between 0.0 and 10.0';
      }
      if (formData.targetAnnualFees < 10000 || isNaN(formData.targetAnnualFees)) {
        newErrors.targetAnnualFees = 'Please enter a valid target annual fee (min ₹10,000)';
      }
    } else if (currentStep === 3) {
      if (!formData.socialCategory) newErrors.socialCategory = 'Select your category';
      if (!formData.familyAnnualIncome) newErrors.familyAnnualIncome = 'Select your income band';
    } else if (currentStep === 4) {
      if (!formData.regionState) newErrors.regionState = 'Select your domicile state';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSave = () => {
    if (validateStep(step)) {
      updateProfile({
        ...formData,
        isOnboardingCompleted: true,
      });
      onClose();
    }
  };

  const handleCgpaChange = (cgpaVal: number) => {
    const clampedCgpa = Math.max(0, Math.min(10, cgpaVal));
    const approxPercentage = Math.round(clampedCgpa * 9.5 * 10) / 10;
    setFormData((prev) => ({
      ...prev,
      marksCgpa: clampedCgpa,
      marksPercentage: approxPercentage,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Onboarding Profile"
      eyebrow="F1 • PROFILE CO-PILOT"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="eyebrow text-[#a9f46b]">
              STEP {step} OF {totalSteps} —{' '}
              {step === 1 && 'ACADEMIC IDENTITY'}
              {step === 2 && 'ACADEMIC MARKS & TARGET FEES'}
              {step === 3 && 'SOCIAL & FINANCIAL STATUS'}
              {step === 4 && 'DOMICILE & VERIFICATION'}
            </span>
            <span className="font-mono text-xs text-[#89918c]">
              {Math.round((step / totalSteps) * 100)}% COMPLETE
            </span>
          </div>

          <div className="h-1.5 w-full bg-[#191f1e] rounded-full overflow-hidden border border-[#222827]">
            <div
              className="h-full bg-[#a9f46b] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
              role="progressbar"
              aria-valuenow={Math.round((step / totalSteps) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Step 1: Academic Identity */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label htmlFor="fullName" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                Full Legal Name (as per Aadhaar / Marks Card)
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
                placeholder="e.g. Ananya Sharma"
              />
              {errors.fullName && (
                <p className="text-xs text-[#ff8e91] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="course" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                  Course Title
                </label>
                <input
                  id="course"
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
                  placeholder="e.g. B.Tech Computer Science"
                />
                {errors.course && (
                  <p className="text-xs text-[#ff8e91] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.course}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="branch" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                  Specialization / Branch
                </label>
                <input
                  id="branch"
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
                  placeholder="e.g. Computer Science & Engg"
                />
                {errors.branch && (
                  <p className="text-xs text-[#ff8e91] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.branch}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="academicLevel" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                  Academic Level
                </label>
                <select
                  id="academicLevel"
                  value={formData.academicLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, academicLevel: e.target.value as EducationLevel })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level} className="bg-[#101313] text-[#edf1ec]">
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="currentYear" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                  Current Year of Study
                </label>
                <select
                  id="currentYear"
                  value={formData.currentYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentYear: e.target.value as StudentProfile['currentYear'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
                >
                  {CURRENT_YEARS.map((yr) => (
                    <option key={yr} value={yr} className="bg-[#101313] text-[#edf1ec]">
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Performance & Fee Needs */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-[#141818] border border-[#222827] rounded-xl">
              <label htmlFor="marksCgpa" className="flex items-center justify-between text-xs font-mono uppercase text-[#89918c] mb-2">
                <span>Academic CGPA (10.0 Scale)</span>
                <span className="text-[#a9f46b] font-bold text-sm">
                  {formData.marksCgpa.toFixed(2)} CGPA (~{formData.marksPercentage}%)
                </span>
              </label>
              <input
                id="marksCgpa"
                type="range"
                min="5.0"
                max="10.0"
                step="0.05"
                value={formData.marksCgpa}
                onChange={(e) => handleCgpaChange(parseFloat(e.target.value))}
                className="w-full accent-[#a9f46b] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#525c57] mt-1">
                <span>5.0 (Pass)</span>
                <span>7.5 (First Class)</span>
                <span>8.5 (Distinction)</span>
                <span>10.0 (Perfect)</span>
              </div>
              {errors.marksCgpa && (
                <p className="text-xs text-[#ff8e91] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.marksCgpa}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="targetAnnualFees" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                Target Annual Tuition & College Fees (₹)
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-[#89918c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="targetAnnualFees"
                  type="number"
                  step="5000"
                  value={formData.targetAnnualFees}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAnnualFees: parseInt(e.target.value) || 0 })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
                  placeholder="e.g. 120000"
                />
              </div>
              <p className="text-[11px] text-[#525c57] mt-1">
                Used to compute the Tuition Gap Visualizer and net out-of-pocket college costs.
              </p>
              {errors.targetAnnualFees && (
                <p className="text-xs text-[#ff8e91] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.targetAnnualFees}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Social & Income Status */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label htmlFor="socialCategory" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                Reservation & Social Category
              </label>
              <select
                id="socialCategory"
                value={formData.socialCategory}
                onChange={(e) =>
                  setFormData({ ...formData, socialCategory: e.target.value as SocialCategory })
                }
                className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
              >
                {SOCIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#101313] text-[#edf1ec]">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.socialCategory && (
                <p className="text-xs text-[#ff8e91] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.socialCategory}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="familyAnnualIncome" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                Family Annual Gross Income Bracket
              </label>
              <select
                id="familyAnnualIncome"
                value={formData.familyAnnualIncome}
                onChange={(e) =>
                  setFormData({ ...formData, familyAnnualIncome: e.target.value as IncomeBracket })
                }
                className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
              >
                {INCOME_BRACKETS.map((bracket) => (
                  <option key={bracket} value={bracket} className="bg-[#101313] text-[#edf1ec]">
                    {bracket}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#525c57] mt-1">
                NSP & corporate trusts require verified income certificates under specified ceilings.
              </p>
            </div>

            {/* Special Considerations checkboxes */}
            <div className="pt-2 space-y-2.5">
              <span className="block text-xs font-mono uppercase text-[#89918c]">
                Special Criteria Affirmations
              </span>

              <label className="flex items-center gap-3 p-3 bg-[#141818] border border-[#222827] hover:border-[#38423f] rounded-xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isFirstGen}
                  onChange={(e) => setFormData({ ...formData, isFirstGen: e.target.checked })}
                  className="w-4 h-4 accent-[#a9f46b] rounded"
                />
                <div>
                  <span className="text-xs font-semibold text-[#edf1ec] block">
                    First-Generation College Student
                  </span>
                  <span className="text-[11px] text-[#89918c]">
                    Neither parent graduated from a recognized higher educational institute.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#141818] border border-[#222827] hover:border-[#38423f] rounded-xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isSingleGirlChild}
                  onChange={(e) => setFormData({ ...formData, isSingleGirlChild: e.target.checked })}
                  className="w-4 h-4 accent-[#a9f46b] rounded"
                />
                <div>
                  <span className="text-xs font-semibold text-[#edf1ec] block">
                    Single Girl Child Candidate
                  </span>
                  <span className="text-[11px] text-[#89918c]">
                    Eligible for exclusive UGC / Corporate STEM girl child scholarships.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Domicile & Summary */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label htmlFor="regionState" className="block text-xs font-mono uppercase text-[#89918c] mb-1.5">
                Domicile State / Union Territory
              </label>
              <select
                id="regionState"
                value={formData.regionState}
                onChange={(e) => setFormData({ ...formData, regionState: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#141818] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-xl text-sm text-[#edf1ec] outline-none transition-colors"
              >
                {POPULAR_STATES.map((st) => (
                  <option key={st} value={st} className="bg-[#101313] text-[#edf1ec]">
                    {st}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#525c57] mt-1">
                State DBT portals require matching permanent domicile certificates.
              </p>
            </div>

            {/* Profile Review Summary Card */}
            <div className="p-4 bg-[#141818] border border-[#222827] rounded-xl space-y-3">
              <span className="eyebrow text-[#a9f46b] block">VERIFIED PROFILE DIGEST</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#89918c] block text-[10px]">CANDIDATE</span>
                  <span className="font-semibold text-[#edf1ec]">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-[#89918c] block text-[10px]">ACADEMIC SCORE</span>
                  <span className="font-semibold text-[#a9f46b]">{formData.marksCgpa.toFixed(2)} CGPA</span>
                </div>
                <div>
                  <span className="text-[#89918c] block text-[10px]">CATEGORY & INCOME</span>
                  <span className="font-semibold text-[#edf1ec]">
                    {formData.socialCategory} • {formData.familyAnnualIncome.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-[#89918c] block text-[10px]">DOMICILE</span>
                  <span className="font-semibold text-[#edf1ec]">{formData.regionState}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#222827] flex items-center gap-2 text-[11px] text-[#89918c]">
                <CheckCircle2 className="w-4 h-4 text-[#a9f46b]" />
                <span>Zero duplicate form filling: all 20+ grants auto-evaluate against this record.</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="pt-4 border-t border-[#222827] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-panel px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-[#89918c] hover:text-[#edf1ec] transition-colors"
            >
              Cancel
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-mint px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="btn-mint px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Profile & Recalculate Matches</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
