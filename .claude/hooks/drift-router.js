/**
 * Drift Auto-Routing Hook
 * UserPromptSubmit: Parse user intent → invoke right skill
 *
 * Bypass rules (never route):
 * - Starts with "/" → slash command
 * - Starts with "!" → explicit escape
 * - Ends with "?" → question
 * - <4 chars → ack ("yes", "ok")
 */

module.exports = {
  hookType: 'UserPromptSubmit',
  handler: async (message, context) => {
    const text = message.trim();

    // Bypass rules
    if (text.startsWith('/')) return message; // Slash command
    if (text.startsWith('!')) return message; // Explicit escape
    if (text.endsWith('?')) return message; // Question
    if (text.length < 4) return message; // Short ack

    // Auto-routing disabled?
    const autoRoutingEnabled = process.env.DRIFT_AUTO_ROUTING !== 'off';
    if (!autoRoutingEnabled) return message;

    // Parse intent from full text (better pattern matching)
    const textLower = text.toLowerCase();

    let skill = null;
    let domain = null;

    // Detect domain from keywords
    const domainPatterns = {
      database: [
        'database', 'schema', 'migration', 'table', 'column', 'query',
        'drizzle', 'prisma', 'orm', 'sql', 'postgres', 'sql query',
        'data model', 'entity', 'index', 'constraint'
      ],
      api: [
        'api', 'endpoint', 'route', 'rest', 'graphql', 'webhook',
        'request', 'response', 'status code', 'error handling',
        'http', 'post', 'get', 'put', 'delete'
      ],
      auth: [
        'auth', 'login', 'signup', 'password', 'token', 'session',
        'jwt', 'oauth', 'permissions', 'roles', 'access control',
        'security', 'credential', 'mfa', '2fa'
      ],
      ui: [
        'component', 'page', 'form', 'button', 'modal', 'layout',
        'styling', 'tailwind', 'responsive', 'dark mode', 'theme',
        'ui', 'ux', 'design', 'interface', 'display'
      ],
      infra: [
        'deploy', 'ci/cd', 'github', 'vercel', 'docker', 'ci',
        'pipeline', 'environment', 'config', 'monitoring', 'payment',
        'stripe', 'billing', 'subscription', 'webhook', 'infrastructure'
      ],
      content: [
        'markdown', 'rich text', 'cms', 'blog', 'content', 'i18n',
        'translation', 'locale', 'language', 'documentation'
      ]
    };

    // Check which domains match
    for (const [d, keywords] of Object.entries(domainPatterns)) {
      if (keywords.some(kw => textLower.includes(kw))) {
        domain = d;
        break; // First match wins
      }
    }

    // Route by action verb
    if (
      textLower.includes('add ') ||
      textLower.includes('build ') ||
      textLower.includes('create ') ||
      textLower.includes('implement ') ||
      textLower.includes('build a ') ||
      textLower.includes('add a ')
    ) {
      // Feature creation: clarify if ambiguous, then scout → architect → ship
      skill = '/ship-feature';
    } else if (
      textLower.includes('fix ') ||
      textLower.includes('bug ') ||
      textLower.includes('broken ') ||
      textLower.match(/^(fix|bug)/)
    ) {
      skill = '/ship-bug';
    } else if (
      textLower.includes('refactor ') ||
      textLower.includes('improve ') ||
      textLower.includes('optimize ') ||
      textLower.includes('rewrite ')
    ) {
      // Refactor: plan only, don't build
      skill = '/drift-architect';
    } else if (
      textLower.includes('research ') ||
      textLower.includes('investigate ') ||
      textLower.includes('explore ') ||
      textLower.includes('find ')
    ) {
      // Investigation: scout only
      skill = '/drift-scout';
    } else if (
      textLower.includes('learn ') ||
      textLower.includes('remember ') ||
      textLower.includes('remember ') ||
      textLower.includes('pattern ')
    ) {
      skill = '/learn';
    } else if (
      textLower.includes('status') ||
      textLower.includes('stats') ||
      textLower.includes('metrics')
    ) {
      skill = '/drift:status';
    } else if (textLower.includes('explain ') || textLower.includes('why ')) {
      // Questions → no routing
      return message;
    }

    // If routing detected, prepend skill invocation
    if (skill) {
      // Inject brain snapshot if available
      const brainContext = context.brainSnapshot || '';
      const domainHint = domain ? ` [domain: ${domain}]` : '';
      return `${brainContext}\n\n${skill}${domainHint} ${text}`;
    }

    return message;
  }
};
