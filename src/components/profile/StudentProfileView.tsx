import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { EducationLevel, IncomeBracket, SocialCategory, StudentProfile } from '../../types/scholarship';
import { CheckCircle2, Save, RotateCcw } from 'lucide-react';
import { DEFAULT_STUDENT_PROFILE } from '../../data/mockScholarships';
import { sanitizeProfileStrings } from '../../utils/security';

/**
 * Comprehensive student profile settings view with input sanitization and form validation
 */
export const StudentProfileView: React.FC = () => {
  const { profile, updateProfile } = useScholarshipContext();
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(
      sanitizeProfileStrings({
        ...profile,
        fullName: profile.fullName.trim(),
        branch: profile.branch.trim(),
        regionState: profile.regionState.trim(),
      })
    );
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleCgpaChange = (cgpaVal: number) => {
    const clampedCgpa = Math.max(0, Math.min(10, cgpaVal));
    const approxPercentage = Math.round(clampedCgpa * 9.5 * 10) / 10;
    updateProfile({
      marksCgpa: clampedCgpa,
      marksPercentage: approxPercentage,
    });
  };

  return (
    <section aria-label="Student Profile Settings" className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-card)] gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold font-mono text-base">
              {profile.fullName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <span className="eyebrow text-emerald-700 dark:text-emerald-400 block">STUDENT PROFILE RECORD</span>
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                {profile.fullName} • Credentials
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Matches Central NSP, state DBT portals, and corporate CSR schemes against these verified details.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => updateProfile(DEFAULT_STUDENT_PROFILE)}
            className="btn-panel px-3 py-1.5 text-xs font-mono font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
            title="Reset to benchmark student Ananya Sharma"
            aria-label="Reset profile to benchmark student"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {savedAlert && (
          <div
            role="status"
            className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile saved to browser storage. All scholarship match scores recalculated in real-time.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label htmlFor="prof-name" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Full Name (as per Aadhaar Card)
              </label>
              <input
                id="prof-name"
                type="text"
                maxLength={80}
                value={profile.fullName}
                onChange={(e) => updateProfile({ fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs text-[var(--text-primary)] outline-none"
                required
              />
            </div>

            {/* CGPA */}
            <div>
              <label htmlFor="prof-cgpa" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Academic CGPA (10.0 scale)
              </label>
              <input
                id="prof-cgpa"
                type="number"
                step="0.05"
                min="0.0"
                max="10.0"
                value={profile.marksCgpa}
                onChange={(e) => handleCgpaChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold outline-none"
                required
              />
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">
                Approx percentage: ~{profile.marksPercentage}% (AICTE standard formula)
              </span>
            </div>

            {/* Academic Level */}
            <div>
              <label htmlFor="prof-level" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Academic Program / Degree
              </label>
              <select
                id="prof-level"
                value={profile.academicLevel}
                onChange={(e) =>
                  updateProfile({ academicLevel: e.target.value as EducationLevel })
                }
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs text-[var(--text-primary)] outline-none cursor-pointer"
              >
                <option value="Undergraduate">Undergraduate (B.Tech/MBBS)</option>
                <option value="Postgraduate">Postgraduate (M.Tech/MBA)</option>
                <option value="PhD / Research">PhD / PMRF Research</option>
                <option value="Class 11-12">Class 11-12</option>
              </select>
            </div>

            {/* Current Year */}
            <div>
              <label htmlFor="prof-year" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Current Year of Study
              </label>
              <select
                id="prof-year"
                value={profile.currentYear}
                onChange={(e) =>
                  updateProfile({ currentYear: e.target.value as StudentProfile['currentYear'] })
                }
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs text-[var(--text-primary)] outline-none cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* Branch / Stream */}
            <div>
              <label htmlFor="prof-branch" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Branch / Specialization
              </label>
              <input
                id="prof-branch"
                type="text"
                maxLength={80}
                value={profile.branch}
                onChange={(e) => updateProfile({ branch: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs text-[var(--text-primary)] outline-none"
                placeholder="e.g. Computer Science & Engg, Mechanical, MBBS"
                required
              />
            </div>

            {/* Annual Family Income */}
            <div>
              <label htmlFor="prof-income" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Annual Family Income Bracket
              </label>
              <select
                id="prof-income"
                value={profile.familyAnnualIncome}
                onChange={(e) =>
                  updateProfile({
                    familyAnnualIncome: e.target.value as IncomeBracket,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs text-[var(--text-primary)] outline-none cursor-pointer"
              >
                <option value="< ₹2.5 Lakhs (Full EWS)">&lt; ₹2.5 Lakhs (Full EWS / BPL)</option>
                <option value="₹2.5L - ₹5 Lakhs">₹2.5L - ₹5 Lakhs (CSR eligible)</option>
                <option value="₹5L - ₹8 Lakhs (Non-Creamy Limit)">₹5L - ₹8 Lakhs (OBC-NCL / EWS limit)</option>
                <option value="> ₹8 Lakhs (General / Creamy Layer)">&gt; ₹8 Lakhs (General / Creamy Layer)</option>
              </select>
            </div>

            {/* Social Category */}
            <div>
              <label htmlFor="prof-category" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Social / Reservation Category
              </label>
              <select
                id="prof-category"
                value={profile.socialCategory}
                onChange={(e) =>
                  updateProfile({ socialCategory: e.target.value as SocialCategory })
                }
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs text-[var(--text-primary)] outline-none cursor-pointer"
              >
                <option value="General">General (Unreserved)</option>
                <option value="General (EWS)">General (EWS)</option>
                <option value="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
              </select>
            </div>

            {/* Domicile State */}
            <div>
              <label htmlFor="prof-region" className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                Permanent Domicile State
              </label>
              <input
                id="prof-region"
                type="text"
                maxLength={60}
                value={profile.regionState}
                onChange={(e) => updateProfile({ regionState: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-xl text-xs text-[var(--text-primary)] outline-none"
                placeholder="e.g. Karnataka, Delhi, Maharashtra"
                required
              />
            </div>
          </div>

          {/* Quota Toggles */}
          <div className="pt-2 space-y-2 border-t border-[var(--border-card)]">
            <label className="flex items-center gap-3 p-3 bg-[var(--bg-card-subtle)] border border-[var(--border-card)] rounded-xl cursor-pointer hover:border-emerald-500/30 transition-colors">
              <input
                type="checkbox"
                checked={profile.isFirstGen}
                onChange={(e) => updateProfile({ isFirstGen: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <span className="text-xs text-[var(--text-primary)]">
                First-Generation College Student (First in immediate family to attend university)
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-[var(--bg-card-subtle)] border border-[var(--border-card)] rounded-xl cursor-pointer hover:border-emerald-500/30 transition-colors">
              <input
                type="checkbox"
                checked={profile.isSingleGirlChild}
                onChange={(e) => updateProfile({ isSingleGirlChild: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <span className="text-xs text-[var(--text-primary)]">
                Single Girl Child (Eligible for special UGC & Corporate STEM female empowerment schemes)
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-[var(--border-card)] flex justify-end">
            <button
              type="submit"
              className="btn-mint inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save & Re-Index Matches</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
