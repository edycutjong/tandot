// ============================================================
// Tandot — Lightweight i18n (Spanish / English)
// Client-side locale toggle with typed dictionary keys
// ============================================================

export type Locale = 'es' | 'en';

export interface Dictionary {
  // Nav
  nav_launch: string;

  // Hero
  hero_badge: string;
  hero_headline_prefix: string;
  hero_headline_highlight: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;

  // Floating cards
  float_escrow_status: string;
  float_escrow_value: string;
  float_current_round: string;
  float_next_payout: string;
  float_next_payout_value: string;
  float_ai_engine: string;
  float_ai_analyzing: string;
  float_incoming: string;
  float_trust_score: string;

  // Stats
  stat_volume: string;
  stat_participants: string;
  stat_payouts: string;
  stat_trust: string;

  // How It Works
  how_title: string;
  how_subtitle: string;
  how_step1_title: string;
  how_step1_desc: string;
  how_step2_title: string;
  how_step2_desc: string;
  how_step3_title: string;
  how_step3_desc: string;

  // Sponsor
  sponsor_label: string;

  // Footer
  footer_brand: string;
  footer_github: string;
  footer_contracts: string;
  footer_docs: string;

  // Language toggle
  lang_toggle: string;
}

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    // Nav
    nav_launch: 'Iniciar App',

    // Hero
    hero_badge: 'ETHEREUM MEXICO 2026',
    hero_headline_prefix: 'Tandas ',
    hero_headline_highlight: 'sin confianza ciega',
    hero_subtitle: 'Tandas rotativas protegidas por IA y escrow en MXNB.',
    hero_description:
      '¿Tu organizador de tanda se fue con el dinero? Nunca más. Tandot usa IA + contratos inteligentes para garantizar cada pago.',
    hero_cta_primary: 'Crear mi Tanda',
    hero_cta_secondary: '¿Cómo funciona?',

    // Floating cards
    float_escrow_status: 'Estado del Escrow',
    float_escrow_value: '10,000 MXNB Bloqueados',
    float_current_round: 'Ronda Actual',
    float_next_payout: 'Próximo Pago',
    float_next_payout_value: 'En 3 días',
    float_ai_engine: 'Motor de Confianza IA',
    float_ai_analyzing: 'Analizando Red',
    float_incoming: 'Transferencia Entrante',
    float_trust_score: 'Puntaje de Confianza',

    // Stats
    stat_volume: 'Volumen Protegido',
    stat_participants: 'Participantes Activos',
    stat_payouts: 'Pagos Exitosos',
    stat_trust: 'Trust Score Promedio',

    // How It Works
    how_title: 'Arquitectura Trustless',
    how_subtitle:
      'Reemplazamos al organizador humano con un agente de IA y un contrato de escrow en Arbitrum.',
    how_step1_title: 'AI Trust Matching',
    how_step1_desc:
      'La IA evalúa perfiles, analiza historiales financieros y agrupa participantes con scores de confianza compatibles para minimizar el riesgo de impago.',
    how_step2_title: 'Contribuciones en MXNB',
    how_step2_desc:
      'Cada periodo aportas tu cuota en MXNB a través de Bitso. El capital se bloquea criptográficamente en nuestro contrato inteligente de Arbitrum.',
    how_step3_title: 'Escrow Automatizado',
    how_step3_desc:
      'Cuando es tu turno, el contrato inteligente verifica las aportaciones y libera automáticamente el pozo completo a tu wallet. Sin intermediarios.',

    // Sponsor
    sponsor_label: 'Potenciado por Web3 e IA',

    // Footer
    footer_brand: 'Tandot · Ethereum Mexico 2026',
    footer_github: 'GitHub',
    footer_contracts: 'Contratos',
    footer_docs: 'Documentación',

    // Language toggle
    lang_toggle: 'EN',
  },

  en: {
    // Nav
    nav_launch: 'Launch App',

    // Hero
    hero_badge: 'ETHEREUM MEXICO 2026',
    hero_headline_prefix: 'Tandas ',
    hero_headline_highlight: 'without blind trust',
    hero_subtitle: 'AI-managed, fraud-proof rotating savings circles on MXNB.',
    hero_description:
      'Your tanda organizer ran off with the money? Never again. Tandot uses AI + smart contracts to guarantee every payment.',
    hero_cta_primary: 'Create my Tanda',
    hero_cta_secondary: 'How does it work?',

    // Floating cards
    float_escrow_status: 'Escrow Status',
    float_escrow_value: '10,000 MXNB Locked',
    float_current_round: 'Current Round',
    float_next_payout: 'Next Payout',
    float_next_payout_value: 'In 3 days',
    float_ai_engine: 'AI Trust Engine',
    float_ai_analyzing: 'Analyzing Network',
    float_incoming: 'Incoming Transfer',
    float_trust_score: 'Trust Score',

    // Stats
    stat_volume: 'Protected Volume',
    stat_participants: 'Active Participants',
    stat_payouts: 'Successful Payouts',
    stat_trust: 'Avg Trust Score',

    // How It Works
    how_title: 'Trustless Architecture',
    how_subtitle:
      'We replace the human organizer with an AI agent and an Arbitrum escrow contract.',
    how_step1_title: 'AI Trust Matching',
    how_step1_desc:
      'AI evaluates profiles, analyzes financial histories, and groups participants with compatible trust scores to minimize default risk.',
    how_step2_title: 'MXNB Contributions',
    how_step2_desc:
      'Each period you contribute your share in MXNB via Bitso. Capital is cryptographically locked in our Arbitrum smart contract.',
    how_step3_title: 'Automated Escrow',
    how_step3_desc:
      'When it\'s your turn, the smart contract verifies contributions and automatically releases the full pool to your wallet. No middlemen.',

    // Sponsor
    sponsor_label: 'Powered by Web3 & AI Infrastructure',

    // Footer
    footer_brand: 'Tandot · Ethereum Mexico 2026',
    footer_github: 'GitHub',
    footer_contracts: 'Contracts',
    footer_docs: 'Documentation',

    // Language toggle
    lang_toggle: 'ES',
  },
};
