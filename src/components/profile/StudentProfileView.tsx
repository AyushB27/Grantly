import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { EducationLevel, IncomeBracket, SocialCategory } from '../../types/scholarship';
import { CheckCircle2, Save, RotateCcw } from 'lucide-react';
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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold text-base">
              {profile.fullName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Student Profile • Indian Scholarship Portal
              </h2>
              <p className="text-xs text-slate-500">
                Grantly matches central NSP, state DBT schemes, and corporate CSR grants against these verified credentials.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => updateProfile(DEFAULT_STUDENT_PROFILE)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Reset to benchmark Indian student Aarav Sharma"
            aria-label="Reset profile to benchmark student Aarav Sharma"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Profile</span>
          </button>
        </div>

        {savedAlert && (
          <div
            role="status"
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Student profile updated! Central, state, and CSR scholarship matches recalculated in real time.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label htmlFor="prof-name" className="block text-xs font-bold text-slate-700 mb-1">
                Student Full Name (As per Aadhaar Card)
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

            {/* CGPA */}
            <div>
              <label htmlFor="prof-cgpa" className="block text-xs font-bold text-slate-700 mb-1">
                Cumulative CGPA (10.0 scale) / Percentage
              </label>
              <input
                id="prof-cgpa"
                type="number"
                step="0.05"
                min="0.0"
                max="10.0"
                value={profile.cgpa}
                onChange={(e) => updateProfile({ cgpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Approx percentage: ~{(profile.cgpa * 9.5).toFixed(1)}% (AICTE/CBSE formula)
              </span>
            </div>

            {/* Academic Level */}
            <div>
              <label htmlFor="prof-level" className="block text-xs font-bold text-slate-700 mb-1">
                Current Course / Academic Program
              </label>
              <select
                id="prof-level"
                value={profile.academicLevel}
                onChange={(e) =>
                  updateProfile({ academicLevel: e.target.value as EducationLevel })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="Class 11-12">Class 11-12 (Higher Secondary)</option>
                <option value="Undergraduate (B.Tech / B.Sc / B.Com / MBBS)">Undergraduate (B.Tech / B.Sc / B.Com / MBBS)</option>
                <option value="Postgraduate (M.Tech / M.Sc / MBA)">Postgraduate (M.Tech / M.Sc / MBA)</option>
                <option value="PhD / Doctoral Research">PhD / Doctoral Research (PMRF Scheme)</option>
              </select>
            </div>

            {/* Branch / Stream */}
            <div>
              <label htmlFor="prof-branch" className="block text-xs font-bold text-slate-700 mb-1">
                Branch / Specialization
              </label>
              <input
                id="prof-branch"
                type="text"
                value={profile.branch}
                onChange={(e) => updateProfile({ branch: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                placeholder="e.g. Computer Science & Engg, Mechanical, MBBS"
                required
              />
            </div>

            {/* Annual Family Income */}
            <div>
              <label htmlFor="prof-income" className="block text-xs font-bold text-slate-700 mb-1">
                Annual Family Income (As per Tehsildar Certificate)
              </label>
              <select
                id="prof-income"
                value={profile.familyAnnualIncome}
                onChange={(e) =>
                  updateProfile({
                    familyAnnualIncome: e.target.value as IncomeBracket,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="< ₹2.5 Lakhs (Full EWS)">&lt; ₹2.5 Lakhs (Full EWS / BPL Priority)</option>
                <option value="₹2.5L - ₹5 Lakhs">₹2.5L - ₹5 Lakhs (Pell / CSR eligible)</option>
                <option value="₹5L - ₹8 Lakhs (Non-Creamy Limit)">₹5L - ₹8 Lakhs (OBC-NCL / EWS limit)</option>
                <option value="> ₹8 Lakhs (General / Creamy Layer)">&gt; ₹8 Lakhs (General / Creamy Layer)</option>
              </select>
            </div>

            {/* Social Category */}
            <div>
              <label htmlFor="prof-category" className="block text-xs font-bold text-slate-700 mb-1">
                Reservation / Social Category
              </label>
              <select
                id="prof-category"
                value={profile.socialCategory}
                onChange={(e) =>
                  updateProfile({ socialCategory: e.target.value as SocialCategory })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="General">General (Unreserved)</option>
                <option value="General (EWS)">General (EWS - Economically Weaker Section)</option>
                <option value="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
              </select>
            </div>
          </div>

          {/* Additional Quota Toggles */}
          <div className="pt-2 space-y-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isFirstGen}
                onChange={(e) => updateProfile({ isFirstGen: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-slate-700">
                First-Generation Learner (First in immediate family to attend university)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isSingleGirlChild}
                onChange={(e) => updateProfile({ isSingleGirlChild: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-slate-700">
                Single Girl Child (Eligible for special UGC / CSR female empowerment grants)
              </span>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile & Re-index Indian Grants</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
