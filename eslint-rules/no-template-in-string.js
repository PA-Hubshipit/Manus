/**
 * Custom ESLint Rule: no-template-in-string
 * ==========================================
 * 
 * Detects template literal syntax (${...}) inside regular strings,
 * which is a common bug when developers forget to use backticks.
 * 
 * This rule specifically targets z-index patterns to prevent bugs like:
 *   className="z-[${Z_INDEX.DROPDOWN}]"  // ❌ Bug: regular string, not template literal
 *   className={`z-[${Z_INDEX.DROPDOWN}]`}  // ✅ Correct: template literal
 * 
 * @example
 * // Bad - template syntax in regular string (won't interpolate)
 * const className = "z-[${Z_INDEX.DROPDOWN}]";
 * 
 * // Good - using template literal
 * const className = `z-[${Z_INDEX.DROPDOWN}]`;
 * 
 * // Good - using Z_CLASS constant
 * const className = Z_CLASS.DROPDOWN;
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow template literal syntax inside regular strings',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      templateInString: '❌ Template literal syntax found inside regular string! This will NOT interpolate. Use backticks (`) instead of quotes, or use Z_CLASS constants from @/lib/z-index.ts.',
      zIndexTemplateInString: '❌ Z-index template literal found inside regular string! Use Z_CLASS.{{layer}} from @/lib/z-index.ts instead of string interpolation.',
    },
  },
  create(context) {
    return {
      Literal(node) {
        // Only check string literals
        if (typeof node.value !== 'string') {
          return;
        }

        const value = node.value;
        
        // Check for ${...} pattern inside the string
        const templatePattern = /\$\{[^}]+\}/;
        if (templatePattern.test(value)) {
          // Check if it's specifically a z-index pattern
          const zIndexPattern = /z-\[\$\{[^}]*Z_INDEX[^}]*\}\]/;
          if (zIndexPattern.test(value)) {
            context.report({
              node,
              messageId: 'zIndexTemplateInString',
              data: {
                layer: 'DROPDOWN/MODAL/etc',
              },
              fix(fixer) {
                // Suggest using Z_CLASS instead
                // This is a simplified fix - in practice, the developer should use Z_CLASS
                const sourceCode = context.getSourceCode();
                const rawText = sourceCode.getText(node);
                
                // Convert "..." to `...`
                if (rawText.startsWith('"') || rawText.startsWith("'")) {
                  const quote = rawText[0];
                  return fixer.replaceText(
                    node,
                    '`' + rawText.slice(1, -1) + '`'
                  );
                }
                return null;
              },
            });
          } else {
            // Generic template-in-string warning
            context.report({
              node,
              messageId: 'templateInString',
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const rawText = sourceCode.getText(node);
                
                // Convert "..." to `...`
                if (rawText.startsWith('"') || rawText.startsWith("'")) {
                  return fixer.replaceText(
                    node,
                    '`' + rawText.slice(1, -1) + '`'
                  );
                }
                return null;
              },
            });
          }
        }
      },
    };
  },
};
