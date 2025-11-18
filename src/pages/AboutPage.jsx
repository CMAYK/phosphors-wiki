import React from 'react';
import { colors, bg, border, text, style } from '../components/colors';

function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-xl p-8 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h2 className="text-4xl font-bold text-white mb-6">About Phosphors.Wiki</h2>
        <div className="space-y-4" style={text(colors.textSecondary)}>
          <p>
            Phosphors.Wiki is a comprehensive database dedicated to cataloging CRT (Cathode Ray Tube) 
            monitors and displays from various manufacturers.
          </p>
          <p>
            Our mission is to preserve the history and technical specifications of these classic 
            displays for enthusiasts, collectors, and historians.
          </p>
          <p><strong className="text-white">Note from the creator:</strong></p>
          <p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;