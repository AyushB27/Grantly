import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { EducationLevel, IncomeBracket } from '../../types/scholarship';
import { UserCheck, Sliders, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const QuickProfileBar: React.FC = () => {
  const { profile, updateProfile } = useScholarshipContext();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      aria-label="Student Profile Match Simulator"
      className="bg-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-indigo-950/20 mb-8 border border-indigo-700/50"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Profile Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-200 shrink-0">
            <UserCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Interactive Profile Simulator
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Re-scoring Active
              </span>
            </div>
            <p className="text-sm font-medium text-slate-100">
              Matching for <span className="font-bold text-white">{profile.fullName}</span> (GPA:{' '}
              <span className="font-bold text-amber-300">{profile.gpa.toFixed(2)}</span> •{' '}
              {profile.academicLevel} • {profile.major} • {profile.householdIncomeBracket})
            </p>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-800/80 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all border border-indigo-600 focus:ring-2 focus:ring-indigo-400"
            aria-expanded={isExpanded}
            aria-controls="profile-simulator-controls"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
            <span>{isExpanded ? 'Hide Simulator' : 'Adjust Student Profile'}</span>
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
          className="mt-5 pt-5 border-t border-indigo-800/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* GPA Slider */}
          <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-800">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="sim-gpa" className="text-xs font-semibold text-indigo-200">
                Cumulative GPA
              </label>
              <span className="text-sm font-extrabold text-amber-300">
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
              className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Adjust student GPA"
            />
            <div className="flex justify-between text-[10px] text-indigo-400 mt-1">
              <span>2.00</span>
              <span>3.00</span>
              <span>4.00</span>
            </div>
          </div>

          {/* Academic Level Select */}
          <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-800">
            <label
              htmlFor="sim-level"
              className="block text-xs font-semibold text-indigo-200 mb-1"
            >
              Academic Level
            </label>
            <select
              id="sim-level"
              value={profile.academicLevel}
              onChange={(e) =>
                updateProfile({ academicLevel: e.target.value as EducationLevel })
              }
              className="w-full bg-indigo-900/90 text-white border border-indigo-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              aria-label="Select academic level"
            >
              <option value="High School Senior">High School Senior</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Doctoral">Doctoral</option>
            </select>
          </div>

          {/* Major / Field of Study */}
          <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-800">
            <label
              htmlFor="sim-major"
              className="block text-xs font-semibold text-indigo-200 mb-1"
            >
              Major / Degree Field
            </label>
            <select
              id="sim-major"
              value={profile.major}
              onChange={(e) => updateProfile({ major: e.target.value })}
              className="w-full bg-indigo-900/90 text-white border border-indigo-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
          <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-800 flex flex-col justify-between">
            <div>
              <label
                htmlFor="sim-income"
                className="block text-xs font-semibold text-indigo-200 mb-1"
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
                className="w-full bg-indigo-900/90 text-white border border-indigo-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none mb-2"
                aria-label="Select household income bracket"
              >
                <option value="<$30k">&lt;$30,000 (High Need)</option>
                <option value="$30k-$60k">$30,000 - $60,000 (Pell Eligible)</option>
                <option value="$60k-$100k">$60,000 - $100,000</option>
                <option value=">$100k">&gt;$100,000 (Low Need)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label htmlFor="sim-firstgen" className="text-xs text-indigo-200 cursor-pointer">
                First-Generation Student
              </label>
              <input
                id="sim-firstgen"
                type="checkbox"
                checked={profile.isFirstGen}
                onChange={(e) => updateProfile({ isFirstGen: e.target.checked })}
                className="w-4 h-4 text-indigo-600 bg-indigo-900 border-indigo-700 rounded-sm focus:ring-indigo-400"
                aria-label="Toggle first-generation student status"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
