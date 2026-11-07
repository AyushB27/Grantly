import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { EducationLevel, IncomeBracket, CitizenshipStatus } from '../../types/scholarship';
import { User, CheckCircle2, Save, RotateCcw } from 'lucide-react';
import { DEFAULT_STUDENT_PROFILE } from '../../data/mockScholarships';

export const StudentProfileView: React.FC = () => {
  const { profile, updateProfile } = useScholarshipContext();
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <section aria-label="Student Profile Settings" className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <User className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Student Eligibility Profile
              </h2>
              <p className="text-xs text-slate-500">
                Grantly uses these credentials to deterministically score and personalize every grant.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => updateProfile(DEFAULT_STUDENT_PROFILE)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Reset to default benchmark student"
            aria-label="Reset profile to benchmark student Alex Chen"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Profile</span>
          </button>
        </div>

        {savedAlert && (
          <div
            role="status"
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Student profile saved successfully! All match scores updated in real time.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label htmlFor="prof-name" className="block text-xs font-bold text-slate-700 mb-1">
                Student Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                value={profile.fullName}
                onChange={(e) => updateProfile({ fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            {/* GPA */}
            <div>
              <label htmlFor="prof-gpa" className="block text-xs font-bold text-slate-700 mb-1">
                Cumulative GPA (4.0 scale)
              </label>
              <input
                id="prof-gpa"
                type="number"
                step="0.01"
                min="0.0"
                max="4.0"
                value={profile.gpa}
                onChange={(e) => updateProfile({ gpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            {/* Academic Level */}
            <div>
              <label htmlFor="prof-level" className="block text-xs font-bold text-slate-700 mb-1">
                Enrolled Academic Level
              </label>
              <select
                id="prof-level"
                value={profile.academicLevel}
                onChange={(e) =>
                  updateProfile({ academicLevel: e.target.value as EducationLevel })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="High School Senior">High School Senior</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Doctoral">Doctoral</option>
              </select>
            </div>

            {/* Major */}
            <div>
              <label htmlFor="prof-major" className="block text-xs font-bold text-slate-700 mb-1">
                Primary Major / Field of Study
              </label>
              <input
                id="prof-major"
                type="text"
                value={profile.major}
                onChange={(e) => updateProfile({ major: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                placeholder="e.g. Computer Science, Nursing, Biology"
                required
              />
            </div>

            {/* Income Bracket */}
            <div>
              <label htmlFor="prof-income" className="block text-xs font-bold text-slate-700 mb-1">
                Household Income Bracket
              </label>
              <select
                id="prof-income"
                value={profile.householdIncomeBracket}
                onChange={(e) =>
                  updateProfile({
                    householdIncomeBracket: e.target.value as IncomeBracket,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="<$30k">&lt;$30,000 (Maximum Need)</option>
                <option value="$30k-$60k">$30,000 - $60,000 (Pell Grant Range)</option>
                <option value="$60k-$100k">$60,000 - $100,000 (Moderate Need)</option>
                <option value=">$100k">&gt;$100,000 (Low Financial Need)</option>
              </select>
            </div>

            {/* Citizenship */}
            <div>
              <label htmlFor="prof-citizen" className="block text-xs font-bold text-slate-700 mb-1">
                Citizenship / Residency Status
              </label>
              <select
                id="prof-citizen"
                value={profile.citizenship}
                onChange={(e) =>
                  updateProfile({ citizenship: e.target.value as CitizenshipStatus })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="US Citizen">US Citizen</option>
                <option value="Permanent Resident">Permanent Resident (Green Card)</option>
                <option value="DACA">DACA / Undocumented</option>
                <option value="International">International Student (F-1 / J-1)</option>
              </select>
            </div>
          </div>

          {/* First Gen Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isFirstGen}
                onChange={(e) => updateProfile({ isFirstGen: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-slate-700">
                I am a first-generation college student (neither parent completed a 4-year degree)
              </span>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile & Re-index Grants</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
