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

  // Dashboard sidebar
  dash_tagline: string;
  dash_summary: string;
  dash_my_tandas: string;
  dash_new_tanda: string;
  dash_history: string;
  dash_tools: string;
  dash_ai_trust: string;
  dash_explorer: string;
  dash_network_status: string;
  dash_connected: string;

  // Dashboard Page
  dash_summary_desc: string;
  dash_active_tandas: string;
  dash_fraud_prevented: string;
  dash_view_all: string;
  dash_no_active_tandas: string;
  dash_scheduled: string;
  dash_no_scheduled_payouts: string;
  dash_round: string;
  dash_recipient: string;
  dash_recent_contributions: string;
  dash_no_recent_contributions: string;
  dash_completed_payouts: string;
  dash_no_completed_payouts: string;
  dash_verify: string;
  dash_this_month: string;
  dash_this_week: string;
  dash_on_time: string;
  dash_protected: string;
  dash_members: string;

  // My Tandas Page
  dash_my_tandas_desc: string;
  dash_new_tanda_btn: string;
  dash_all: string;
  dash_no_tandas_filter: string;

  // Status & Freq
  status_active: string;
  status_forming: string;
  status_completed: string;
  status_disputed: string;
  freq_weekly: string;
  freq_biweekly: string;
  freq_monthly: string;
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

    // Dashboard sidebar
    dash_tagline: 'Tandas sin confianza ciega',
    dash_summary: 'Resumen',
    dash_my_tandas: 'Mis Tandas',
    dash_new_tanda: 'Nueva Tanda',
    dash_history: 'Historial',
    dash_tools: 'Herramientas',
    dash_ai_trust: 'IA Trust Score',
    dash_explorer: 'Explorador',
    dash_network_status: 'Arbitrum Sepolia',
    dash_connected: 'MXNB · Conectado',

    // Dashboard Page
    dash_summary_desc: 'Vista general de tus tandas y actividad reciente',
    dash_active_tandas: 'Tandas Activas',
    dash_fraud_prevented: 'Fraudes Prevenidos',
    dash_view_all: 'Ver todas →',
    dash_no_active_tandas: 'No hay tandas activas.',
    dash_scheduled: 'Programado',
    dash_no_scheduled_payouts: 'No hay pagos programados.',
    dash_round: 'Ronda',
    dash_recipient: 'Destinatario:',
    dash_recent_contributions: 'Contribuciones Recientes',
    dash_no_recent_contributions: 'No hay contribuciones recientes.',
    dash_completed_payouts: 'Pagos Completados',
    dash_no_completed_payouts: 'No hay pagos completados.',
    dash_verify: 'Verificar ↗',
    dash_this_month: 'este mes',
    dash_this_week: 'esta semana',
    dash_on_time: 'on-time',
    dash_protected: 'protegidos',
    dash_members: 'miembros',

    // My Tandas Page
    dash_my_tandas_desc: 'Administra tus tandas activas y explora nuevas',
    dash_new_tanda_btn: '+ Nueva Tanda',
    dash_all: 'Todas',
    dash_no_tandas_filter: 'No se encontraron tandas con este filtro.',

    // Status & Freq
    status_active: 'Activa',
    status_forming: 'Formándose',
    status_completed: 'Completada',
    status_disputed: 'En disputa',
    freq_weekly: 'Semanal',
    freq_biweekly: 'Quincenal',
    freq_monthly: 'Mensual',
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

    // Dashboard sidebar
    dash_tagline: 'Trustless Rotating Savings',
    dash_summary: 'Summary',
    dash_my_tandas: 'My Tandas',
    dash_new_tanda: 'New Tanda',
    dash_history: 'History',
    dash_tools: 'Tools',
    dash_ai_trust: 'AI Trust Score',
    dash_explorer: 'Explorer',
    dash_network_status: 'Arbitrum Sepolia',
    dash_connected: 'MXNB · Connected',

    // Dashboard Page
    dash_summary_desc: 'Overview of your tandas and recent activity',
    dash_active_tandas: 'Active Tandas',
    dash_fraud_prevented: 'Fraud Prevented',
    dash_view_all: 'View all →',
    dash_no_active_tandas: 'No active tandas.',
    dash_scheduled: 'Scheduled',
    dash_no_scheduled_payouts: 'No scheduled payouts.',
    dash_round: 'Round',
    dash_recipient: 'Recipient:',
    dash_recent_contributions: 'Recent Contributions',
    dash_no_recent_contributions: 'No recent contributions.',
    dash_completed_payouts: 'Completed Payouts',
    dash_no_completed_payouts: 'No completed payouts.',
    dash_verify: 'Verify ↗',
    dash_this_month: 'this month',
    dash_this_week: 'this week',
    dash_on_time: 'on-time',
    dash_protected: 'protected',
    dash_members: 'members',

    // My Tandas Page
    dash_my_tandas_desc: 'Manage your active tandas and explore new ones',
    dash_new_tanda_btn: '+ New Tanda',
    dash_all: 'All',
    dash_no_tandas_filter: 'No tandas found with this filter.',

    // Status & Freq
    status_active: 'Active',
    status_forming: 'Forming',
    status_completed: 'Completed',
    status_disputed: 'Disputed',
    freq_weekly: 'Weekly',
    freq_biweekly: 'Biweekly',
    freq_monthly: 'Monthly',
  },
};
