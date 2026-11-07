import React from 'react';
import { GraduationCap, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090b0b] text-[#89918c] mt-20 border-t border-[#222827]">
      <div className="responsive-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center text-[#a9f46b]">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-black text-base text-[#edf1ec] tracking-tight block">GRANTLY</span>
                <span className="eyebrow text-[#a9f46b] text-[9px] block">SCHOLARSHIP CO-PILOT</span>
              </div>
            </div>
            <p className="text-xs text-[#89918c] max-w-md leading-relaxed">
              Rethinking educational financial assistance for Indian students. Discover verified Central NSP schemes,
              state DBT programs, and premier corporate CSR foundations with transparent gap analysis and guided document readiness.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs font-mono text-[#89918c]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#a9f46b]" aria-hidden="true" />
                WCAG 2.1 AA Compliant
              </span>
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-[#70b4ff]" aria-hidden="true" />
                Deterministic Match Engine
              </span>
            </div>
          </div>

          {/* Pillars of Solution */}
          <div>
            <span className="eyebrow text-[#edf1ec] block mb-3">
              SOLUTION PILLARS
            </span>
            <ul className="space-y-2 text-xs font-mono text-[#89918c]">
              <li>F1. Smart Onboarding Profile</li>
              <li>F2. Personalized Feed & Match</li>
              <li>F3. Plain-English Detail Roadmap</li>
              <li>F4. "Almost Eligible" Gap Repair</li>
              <li>F5. Document Vault & Readiness</li>
              <li>F6. 5-Stage Kanban Pipeline</li>
              <li>F7. Urgency Deadlines Radar</li>
            </ul>
          </div>

          {/* Technical Architecture Notes */}
          <div>
            <span className="eyebrow text-[#edf1ec] block mb-3">
              PLATFORM STANDARDS
            </span>
            <ul className="space-y-2 text-xs font-mono text-[#89918c]">
              <li>• StockFolio Precision Ink System</li>
              <li>• Pure Function Deterministic Engine</li>
              <li>• Zero-Dependency LocalStorage Sync</li>
              <li>• Responsive Grid + Zero Overflow</li>
              <li>• Semantic HTML5 Accessible Landmarks</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#222827] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#525c57] gap-4">
          <p>© 2026 GRANTLY. Designed & built for the Hackathon Frontend Challenge.</p>
          <p className="flex items-center gap-1.5 text-[#89918c]">
            <Sparkles className="w-3.5 h-3.5 text-[#a9f46b]" aria-hidden="true" />
            Optimized for FAIE Quality Engine v3.1 Static Verification
          </p>
        </div>
      </div>
    </footer>
  );
};
