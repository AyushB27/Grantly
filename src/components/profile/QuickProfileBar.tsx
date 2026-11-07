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
                Active Student Persona
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" /> Live Scoring Active
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="font-bold text-slate-900 text-sm">{profile.fullName}</span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
                GPA {profile.gpa.toFixed(2)}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                {profile.academicLevel}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                {profile.major}
              </span>
              {profile.isFirstGen && (
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                  First-Gen
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
            <span>{isExpanded ? 'Close Simulator' : 'Test Other Profile Criteria'}</span>
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
          {/* GPA Slider */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="sim-gpa" className="text-xs font-bold text-slate-700">
                Cumulative GPA
              </label>
              <span className="text-sm font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {profile.gpa.toFixed(2)}
              </span>
            </div>
            <input
              id="sim-gpa"
              type="range"
              min="2.0"
              max="4.0"
              step="0.05"
              value={profile.gpa}
              onChange={(e) => updateProfile({ gpa: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Adjust student GPA"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-semibold mt-1.5">
              <span>2.00</span>
              <span>3.00</span>
              <span>4.00</span>
            </div>
          </div>

          {/* Academic Level Select */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <label
              htmlFor="sim-level"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Academic Level
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
              <option value="High School Senior">High School Senior</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Doctoral">Doctoral</option>
            </select>
          </div>

          {/* Major / Field of Study */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <label
              htmlFor="sim-major"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Major / Degree Field
            </label>
            <select
              id="sim-major"
              value={profile.major}
              onChange={(e) => updateProfile({ major: e.target.value })}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              aria-label="Select student major"
            >
              <option value="Computer Science">Computer Science (STEM)</option>
              <option value="Software Engineering">Software Engineering (STEM)</option>
              <option value="Biology">Biology (Healthcare/STEM)</option>
              <option value="Nursing">Nursing (Healthcare)</option>
              <option value="Education">Education (Teaching)</option>
              <option value="Design">Design (Creative Arts)</option>
              <option value="Civil Engineering">Civil Engineering (STEM)</option>
              <option value="Business Administration">Business / General</option>
            </select>
          </div>

          {/* Income & Background Toggles */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <label
                htmlFor="sim-income"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Household Income Bracket
              </label>
              <select
                id="sim-income"
                value={profile.householdIncomeBracket}
                onChange={(e) =>
                  updateProfile({
                    householdIncomeBracket: e.target.value as IncomeBracket,
                  })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs mb-2"
                aria-label="Select household income bracket"
              >
                <option value="<$30k">&lt;$30k (High Need)</option>
                <option value="$30k-$60k">$30k-$60k (Pell Eligible)</option>
                <option value="$60k-$100k">$60k-$100k</option>
                <option value=">$100k">&gt;$100k (Low Need)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <label htmlFor="sim-firstgen" className="text-xs font-medium text-slate-700 cursor-pointer">
                First-Generation
              </label>
              <input
                id="sim-firstgen"
                type="checkbox"
                checked={profile.isFirstGen}
                onChange={(e) => updateProfile({ isFirstGen: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
                aria-label="Toggle first-generation student status"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
