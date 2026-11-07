import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { EducationLevel, IncomeBracket } from '../../types/scholarship';
import { Sliders, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const QuickProfileBar: React.FC = () => {
  const { profile, updateProfile } = useScholarshipContext();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      aria-label="Student Profile Match Simulator"
      className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90 mb-8 transition-all hover:shadow-md hover:border-indigo-200"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar & Profile Credential Badges */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
            {profile.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Active Student Persona • Indian Education Ecosystem
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" /> Live Scoring Active
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="font-bold text-slate-900 text-sm">{profile.fullName}</span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
                {profile.cgpa.toFixed(2)} CGPA (~{(profile.cgpa * 9.5).toFixed(0)}%)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                {profile.academicLevel.split(' ')[0]}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                {profile.branch}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
                {profile.socialCategory}
              </span>
              {profile.isFirstGen && (
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                  First-Gen Learner
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Adjust Trigger Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isExpanded
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
            }`}
            aria-expanded={isExpanded}
            aria-controls="profile-simulator-controls"
          >
            <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isExpanded ? 'Close Simulator' : 'Test Other Indian Profile Criteria'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div
          id="profile-simulator-controls"
          className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200"
        >
          {/* CGPA Slider (10-point scale) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="sim-cgpa" className="text-xs font-bold text-slate-700">
                Academic Score (CGPA)
              </label>
              <span className="text-sm font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {profile.cgpa.toFixed(2)} CGPA
              </span>
            </div>
            <input
              id="sim-cgpa"
              type="range"
              min="5.0"
              max="10.0"
              step="0.05"
              value={profile.cgpa}
              onChange={(e) => updateProfile({ cgpa: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Adjust student CGPA on 10 point scale"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-semibold mt-1.5">
              <span>5.00 (Pass)</span>
              <span>7.50 (1st Div)</span>
              <span>10.00 (Topper)</span>
            </div>
          </div>

          {/* Academic Level Select */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <label
              htmlFor="sim-level"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Academic Course Level
            </label>
            <select
              id="sim-level"
              value={profile.academicLevel}
              onChange={(e) =>
                updateProfile({ academicLevel: e.target.value as EducationLevel })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              aria-label="Select academic level"
            >
              <option value="Class 11-12">Class 11-12 (Higher Secondary)</option>
              <option value="Undergraduate (B.Tech / B.Sc / B.Com / MBBS)">Undergraduate (B.Tech / B.Sc / MBBS)</option>
              <option value="Postgraduate (M.Tech / M.Sc / MBA)">Postgraduate (M.Tech / M.Sc / MBA)</option>
              <option value="PhD / Doctoral Research">PhD / Doctoral Research (PMRF)</option>
            </select>
          </div>

          {/* Branch / Stream */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <label
              htmlFor="sim-branch"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Degree Stream / Branch
            </label>
            <select
              id="sim-branch"
              value={profile.branch}
              onChange={(e) => updateProfile({ branch: e.target.value })}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              aria-label="Select student branch"
            >
              <option value="Computer Science & Engineering">Computer Science & Engg (STEM)</option>
              <option value="Electronics & Communication">Electronics & Comm (STEM)</option>
              <option value="Mechanical Engineering">Mechanical Engineering (STEM)</option>
              <option value="Civil Engineering">Civil Engineering (STEM)</option>
              <option value="MBBS / Medical Sciences">MBBS / Nursing (Medical)</option>
              <option value="Physics / Basic Sciences">Pure Sciences (INSPIRE)</option>
              <option value="Commerce & Business">Commerce / B.Com / BBA</option>
            </select>
          </div>

          {/* Annual Family Income & Quotas */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <label
                htmlFor="sim-income"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Annual Family Income (EWS Cutoff)
              </label>
              <select
                id="sim-income"
                value={profile.familyAnnualIncome}
                onChange={(e) =>
                  updateProfile({
                    familyAnnualIncome: e.target.value as IncomeBracket,
                  })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs mb-2"
                aria-label="Select family annual income bracket"
              >
                <option value="< ₹2.5 Lakhs (Full EWS)">&lt; ₹2.5 Lakhs (EWS / BPL Priority)</option>
                <option value="₹2.5L - ₹5 Lakhs">₹2.5L - ₹5 Lakhs (Moderate Need)</option>
                <option value="₹5L - ₹8 Lakhs (Non-Creamy Limit)">₹5L - ₹8 Lakhs (Non-Creamy Limit)</option>
                <option value="> ₹8 Lakhs (General / Creamy Layer)">&gt; ₹8 Lakhs (Creamy Layer)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <label htmlFor="sim-firstgen" className="text-xs font-medium text-slate-700 cursor-pointer">
                First-Gen Learner
              </label>
              <input
                id="sim-firstgen"
                type="checkbox"
                checked={profile.isFirstGen}
                onChange={(e) => updateProfile({ isFirstGen: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
                aria-label="Toggle first-generation learner status"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
