/**
 * Custom ESLint Rules for Multi-AI Chat
 * ======================================
 * 
 * This module exports custom ESLint rules for the project.
 * 
 * Rules:
 * - no-template-in-string: Detects template literal syntax inside regular strings
 */

import noTemplateInString from './no-template-in-string.js';

export default {
  rules: {
    'no-template-in-string': noTemplateInString,
  },
};
