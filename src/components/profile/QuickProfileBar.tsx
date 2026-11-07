import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { IncomeBracket, SocialCategory } from '../../types/scholarship';
import { Sliders, ChevronDown, ChevronUp, Sparkles, UserCheck } from 'lucide-react';

export const QuickProfileBar: React.FC = () => {
  const { profile, updateProfile, setIsOnboardingOpen } = useScholarshipContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const approxPercentage = Math.round(profile.marksCgpa * 9.5 * 10) / 10;

  return (
    <section
      aria-label="Student Profile Match Simulator"
      className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] mb-8 transition-all hover:border-emerald-500/40 shadow-xs"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar & Profile Credential Badges */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold font-mono text-sm shrink-0">
            {profile.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-emerald-700 dark:text-emerald-400">ACTIVE CANDIDATE PROFILE</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-2.5 h-2.5" /> Deterministic Matching Active
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="font-bold text-[var(--text-primary)] text-sm">{profile.fullName}</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card-hover)] text-emerald-700 dark:text-emerald-400 border border-[var(--border-card)] font-mono text-xs font-bold">
                {profile.marksCgpa.toFixed(2)} CGPA (~{approxPercentage}%)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-card)] font-mono text-xs">
                {profile.course}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-card)] font-mono text-xs">
                {profile.socialCategory}
              </span>
              {profile.isFirstGen && (
                <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card-hover)] text-purple-700 dark:text-purple-400 border border-[var(--border-card)] font-mono text-xs">
                  First-Gen
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="btn-mint px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Edit Full Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-panel px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            aria-expanded={isExpanded}
            aria-controls="profile-simulator-controls"
          >
            <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isExpanded ? 'Hide Simulator' : 'Quick Simulate'}</span>
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
          className="mt-4 pt-4 border-t border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200"
        >
          {/* CGPA Slider (10-point scale) */}
          <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-card)]">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="sim-cgpa" className="eyebrow text-[var(--text-muted)]">
                SIMULATE CGPA
              </label>
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {profile.marksCgpa.toFixed(2)}
              </span>
            </div>
            <input
              id="sim-cgpa"
              type="range"
              min="5.0"
              max="10.0"
              step="0.05"
              value={profile.marksCgpa}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                updateProfile({
                  marksCgpa: val,
                  marksPercentage: Math.round(val * 9.5 * 10) / 10,
                });
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mt-1">
              <span>5.0</span>
              <span>8.0</span>
              <span>10.0</span>
            </div>
          </div>

          {/* Category Simulator */}
          <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-card)]">
            <label htmlFor="sim-category" className="eyebrow text-[var(--text-muted)] block mb-1.5">
              SOCIAL CATEGORY
            </label>
            <select
              id="sim-category"
              value={profile.socialCategory}
              onChange={(e) =>
                updateProfile({ socialCategory: e.target.value as SocialCategory })
              }
              className="w-full px-2.5 py-1.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-lg text-xs font-mono text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="General">General (Unreserved)</option>
              <option value="General (EWS)">General (EWS)</option>
              <option value="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
            </select>
          </div>

          {/* Income Simulator */}
          <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-card)]">
            <label htmlFor="sim-income" className="eyebrow text-[var(--text-muted)] block mb-1.5">
              INCOME CEILING
            </label>
            <select
              id="sim-income"
              value={profile.familyAnnualIncome}
              onChange={(e) =>
                updateProfile({ familyAnnualIncome: e.target.value as IncomeBracket })
              }
              className="w-full px-2.5 py-1.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-lg text-xs font-mono text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="< ₹2.5 Lakhs (Full EWS)">&lt; ₹2.5 Lakhs (Full EWS)</option>
              <option value="₹2.5L - ₹5 Lakhs">₹2.5L - ₹5 Lakhs</option>
              <option value="₹5L - ₹8 Lakhs (Non-Creamy Limit)">₹5L - ₹8 Lakhs</option>
              <option value="> ₹8 Lakhs (General / Creamy Layer)">&gt; ₹8 Lakhs</option>
            </select>
          </div>

          {/* Domicile State */}
          <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-card)]">
            <label htmlFor="sim-region" className="eyebrow text-[var(--text-muted)] block mb-1.5">
              DOMICILE STATE
            </label>
            <select
              id="sim-region"
              value={profile.regionState}
              onChange={(e) => updateProfile({ regionState: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-lg text-xs font-mono text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="All India">All India</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};
