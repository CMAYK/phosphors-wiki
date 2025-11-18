// Central color palette for the entire application
export const colors = {
  // Backgrounds (10% brighter)
  background: '#1a1a1a',      // Main background (was #0a0a0a)
  cardBg: '#353535',          // Cards/Panels (was #262626)
  darkBg: '#2a2a2a',          // Darker backgrounds (was #171717)
  
  // Borders
  border: '#4d4d4d',          // Medium gray borders (was #404040)
  
  // Interactive elements
  interactive: '#4d4d4d',     // Buttons, inputs (was #404040)
  
  // Text
  textPrimary: '#ffffff',     // Primary text (white)
  textSecondary: '#e0e0e0',   // Secondary text (was #d4d4d4)
  textTertiary: '#b8b8b8',    // Tertiary/muted text (was #a3a3a3)
  textDisabled: '#666666',    // Disabled/placeholder (was #525252)
};

// Helper function to apply inline styles easily
export const bg = (color) => ({ backgroundColor: color });
export const border = (color) => ({ borderColor: color });
export const text = (color) => ({ color: color });
export const style = (...styles) => Object.assign({}, ...styles);