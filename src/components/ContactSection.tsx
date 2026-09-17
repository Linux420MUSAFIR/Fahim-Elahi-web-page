import React, { useState } from 'react';
import { ArrowUpRight, Mail, Copy, CheckCheck, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'fahimelahi70@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 px-5 sm:px-8 max-w-7xl mx-auto bg-[#F7F6F2]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Inquiry Ethos & Coordinates */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5AC27]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#666666]">
              04 // contact & collaboration
            </span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tighter lowercase leading-none text-[#0A0A0A] mb-6">
            initiate dialogue
          </h2>

          <p className="text-base sm:text-lg text-[#333333] leading-relaxed mb-8 max-w-lg">
            Available for 3D art, 3D animation, and filmmaking projects worldwide. 
            Have a story to tell or an ambitious visual idea to bring to life? Let's connect.
          </p>

          <div className="space-y-4 pt-6 border-t border-[#E5E5E5] text-xs font-mono">
            <div>
              <span className="uppercase text-[#888888] block mb-1">direct contact email</span>
              <a
                href={`mailto:${emailAddress}`}
                className="text-[#0A0A0A] hover:text-[#F5AC27] font-semibold text-base transition-colors inline-flex items-center gap-1.5"
              >
                <span>{emailAddress}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div>
              <span className="uppercase text-[#888888] block mb-1">instagram direct</span>
              <a
                href="https://www.instagram.com/musafir_bhai420?stkn=MTFraGNtYzFpZDQyMg=="
                target="_blank"
                rel="noreferrer"
                className="text-[#0A0A0A] hover:text-[#F5AC27] font-semibold text-base transition-colors inline-flex items-center gap-1.5"
              >
                <span>@musafir_bhai420</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2">
              <span className="uppercase text-[#888888] block mb-1">availability</span>
              <div className="flex items-center gap-2 text-[#0A0A0A] font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for new commissions & film direction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Direct Contact Card */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-12 rounded-[24px] border border-[#E5E5E5] shadow-sm flex flex-col justify-between space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5AC27]/15 text-[#0A0A0A] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#F5AC27]" />
              <span>Let's create meaningful cinema</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
              Ready to start your next visual story?
            </h3>
            <p className="text-sm text-[#555555] font-normal leading-relaxed">
              Reach out directly to discuss 3D animation, CGI modeling, visual development, or directorial work.
            </p>
          </div>

          <div className="p-4 bg-[#F7F6F2] rounded-2xl border border-[#E5E5E5] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#0A0A0A]" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono uppercase text-[#777777] block">Email</span>
                <span className="text-sm font-mono font-bold text-[#0A0A0A] truncate block">
                  {emailAddress}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-white border border-[#E5E5E5] hover:border-[#0A0A0A] text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <a
            href={`mailto:${emailAddress}?subject=Project%20Inquiry%20-%20Fahim%20A%20Elahi`}
            className="w-full bg-[#0A0A0A] hover:bg-[#F5AC27] text-white hover:text-[#0A0A0A] py-4 px-6 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Send Direct Email</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
