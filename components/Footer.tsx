import React from 'react';
import { Scale, Github, Twitter, Linkedin, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Dispute De-Escalator</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Empowering individuals to resolve conflicts with clarity, calmness, and AI-driven insights.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security & Privacy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">For Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Dispute Guides</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Legal Dictionary</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Mediator Directory</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sales</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="bg-amber-900/20 border border-amber-900/50 p-4 rounded-lg flex gap-3 items-start mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              <strong>Disclaimer:</strong> This system is an automated AI tool provided for informational and educational purposes only. It is not a law firm, attorney, or substitute for legal advice. The "Resolution Pathways" generated are suggestions based on general principles and do not constitute legal counsel. Always consult with a qualified attorney in your jurisdiction for legal matters.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; 2024 Dispute De-Escalator AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};