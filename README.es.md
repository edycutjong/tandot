<div align="center">
  <h1>Tandot 🎰</h1>
  <p><em>¿Tu organizador de tanda se fue con el dinero? Nunca más. IA + contratos inteligentes garantizan cada pago.</em></p>
  <img src="docs/readme-hero.png" alt="Tandot" width="100%">

  <br/>

  [![Demo Mainnet](https://img.shields.io/badge/🟢_Mainnet-En_Vivo-06b6d4?style=for-the-badge)](https://mainnet.tandot.edycu.dev)
  [![Demo Testnet](https://img.shields.io/badge/🟡_Testnet-En_Vivo-f59e0b?style=for-the-badge)](https://testnet.tandot.edycu.dev)
  [![Presentación](https://img.shields.io/badge/📊_Presentación-8b5cf6?style=for-the-badge)](https://mainnet.tandot.edycu.dev/pitch)
  [![Video de Pitch](https://img.shields.io/badge/🎬_Video-Pitch-ef4444?style=for-the-badge)](https://youtu.be/gQ0IduJwbo0)
  [![BOTScan](https://img.shields.io/badge/📜_BOTScan-Contratos-28A0F0?style=for-the-badge)](https://scan.bohr.life/address/0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![BOT Chain](https://img.shields.io/badge/BOT_Chain-28A0F0?style=for-the-badge)
  ![Solidity](https://img.shields.io/badge/Solidity_0.8-363636?style=for-the-badge&logo=solidity&logoColor=white)
  ![OpenAI](https://img.shields.io/badge/GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  [![Tandot CI](https://github.com/edycutjong/tandot/actions/workflows/ci.yml/badge.svg)](https://github.com/edycutjong/tandot/actions/workflows/ci.yml)

  <p>
    <a href="README.md">🇺🇸 English Version</a>
  </p>
</div>

---

## 📸 Míralo en Acción

<div align="center">
  <h3>1. Plataforma de Ahorro sin Confianza</h3>
  <img width="100%" alt="tandot-landing" src="https://github.com/user-attachments/assets/dfd12f15-b8a6-4933-8800-2cfcffdcdea6" />
  <br/><br/>

  <h3>2. Dashboard impulsado por IA</h3>
  <img width="100%" alt="my-tandas-1" src="https://github.com/user-attachments/assets/1421f154-c56d-493b-9851-b51e2449ac8d" />
  <br/><br/>

  <h3>3. Flujo Automatizado de Escrow en BOT Chain</h3>
  <img width="100%" alt="tandot-flow" src="https://github.com/user-attachments/assets/b7ea2d21-a853-450f-a765-78ffd2a56d8e" />
</div>

> **Tres pasos, cero confianza ciega.** Únete → Contribuye en MXNB → Cobra tu turno.

---

## 💡 El Problema y la Solución

En México, las **tandas** son la herramienta de ahorro informal más popular, sin embargo, 1 de cada 3 tandas falla porque el organizador desaparece con el dinero. No hay recursos legales, ni seguros, ni pruebas.

**Tandot** elimina al organizador humano por completo. Un agente de IA gestiona la puntuación de confianza, el emparejamiento de grupos y la detección de fraudes, mientras que el MXNB (la stablecoin del peso mexicano) fluye a través de contratos inteligentes de depósito en garantía (escrow) en BOT Chain, garantizando cada pago en cada ronda, siempre.

**Características Clave:**
- 🤖 **Puntuación de Confianza por IA:** GPT-4 evalúa la fiabilidad de cada miembro (0-100) mediante un análisis de 5 factores: historial de pagos, tasa de puntualidad, diversidad del grupo, antigüedad de la cuenta y calidad de las referencias.
- 💰 **Escrow de MXNB en BOT Chain:** Todas las contribuciones fluyen hacia un contrato inteligente sin necesidad de confianza; los fondos se bloquean hasta que se cumplen las condiciones de pago automático.
- 🔒 **Diseño a Prueba de Fraude:** Ninguna persona individual controla el pozo común. El contrato impone el orden de rotación y la IA marca a los miembros riesgosos antes de que se unan. Capacidades de reembolso sin confianza aseguran que los fondos no queden bloqueados permanentemente si una ronda no logra formarse.
- 🎨 **UX Premium Bilingüe:** Diseño emocional pensado primero en español con profundidad técnica en inglés. Estética fintech de glassmorphism, modo oscuro, tipografía Inter + JetBrains Mono + Outfit.

## 🏗️ Arquitectura y Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Estilos** | Tailwind CSS v4 |
| **Base de Datos** | Supabase (PostgreSQL + Realtime) |
| **Pagos** | API de Bitso Business (Depósitos, Pagos, MXNB, Webhooks, Pagos Masivos) |
| **Cadena** | BOT Chain (Stablecoin MXNB, contrato inteligente de escrow) |
| **IA** | OpenAI GPT-4 (puntuación de confianza, emparejamiento, detección de fraude) |
| **Despliegue** | Vercel |

```mermaid
graph TB
    User[👤 Miembro de Tanda] -->|Deposita MXNB| Bitso[Bitso Business API]
    Bitso -->|Webhook| API[Rutas API Next.js]
    API -->|Registra| DB[(Supabase PostgreSQL)]
    API -->|Bloquea Fondos| Escrow[Contrato de Escrow BOT Chain]
    API -->|Califica Miembro| AI[OpenAI GPT-4]
    AI -->|Score de Confianza| DB
    Escrow -->|Pago Automático| Bitso
    Bitso -->|Transferencia MXNB| Winner[🏆 Ganador de la Ronda]

    DB -->|Tiempo Real| Dashboard[UI del Dashboard]
```

## 🏆 Tracks de Patrocinadores Objetivados

| Recompensa (Bounty) | Premio | Integración |
|---|---|---|
| **Bitso Business Startup** | $3,900 | Depósitos, Pagos, transferencias MXNB, Webhooks, Pagos Masivos — ver `src/lib/` |
| **ETH México Principal** | $1,500 | Plataforma DeFi completa que resuelve la confianza financiera en LATAM |
| **BOT Chain** | Ecosystem | Contrato inteligente de escrow desplegado en BOT Chain — ver `contracts/` |


## 🚀 Comenzando

### Prerrequisitos
- Node.js ≥ 20
- npm

### Instalación
```bash
git clone https://github.com/edycutjong/tandot.git
cd tandot
npm install
cp .env.example .env.local   # Agrega tus llaves de API
npm run dev                  # http://localhost:3000
```

### 🚀 Inicio Rápido

| Qué | Estado |
|---|---|
| **Wallet** | Instala [MetaMask](https://metamask.io) → cambia a **BOT Chain** |
| **Contratos Inteligentes** | ✅ Ya desplegados (ver direcciones abajo) |
| **Base de Datos Supabase** | ✅ Pre-sembrada con datos de demostración |
| **API de Bitso** | ✅ Llaves de staging incluidas en el demo — no necesitas cuenta personal |
| **OpenAI** | ✅ La puntuación de confianza funciona con scores pre-calculados localmente |
| **BOT de Prueba** | Obtén BOT gratis en el [Faucet de BOT Chain](https://faucet.botchain.ai) |

### Contratos Desplegados (BOT Chain)

| Contrato | Dirección |
|---|---|
| **TandaEscrow** | [`0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e`](https://scan.bohr.life/address/0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e) |
| **MockMXNB (ERC-20)** | [`0xC57D472C2CD8fbE83B2B9FABd9c167A0C2c6DCEa`](https://scan.bohr.life/address/0xC57D472C2CD8fbE83B2B9FABd9c167A0C2c6DCEa) |

### Cambiar de Red (Testnet ↔ Mainnet)

La app usa **testnet (968)** por defecto. La red activa se selecciona con una sola
variable de entorno, `NEXT_PUBLIC_NETWORK` — el chain ID, RPC, explorador y ambas
direcciones de contrato se definen por red en [`src/lib/constants.ts`](src/lib/constants.ts)
y siempre cambian juntas.

```bash
npm run dev                 # testnet (por defecto)
npm run dev:mainnet         # mainnet (chain 677)
npm run dev:testnet         # testnet (chain 968)
npm run build:mainnet       # build de producción fijado a mainnet
```

O fíjala de forma persistente en `.env.local`:

```bash
NEXT_PUBLIC_NETWORK=mainnet   # o testnet
```

> Los scripts `dev:*` / `build:*` sobrescriben `.env.local` para esa ejecución.

### Redesplegar Contratos (Opcional)

Para desplegar tu propia instancia del contrato de escrow y el token Mock MXNB:

```bash
cd contracts
npm install
cp .env.example .env   # Agrega tu URL RPC de BOT Chain y Llave Privada
npx hardhat compile
npx hardhat run scripts/deploy.ts --network botChainTestnet
```

Luego actualiza las direcciones desplegadas en el registro `NETWORKS` en [`src/lib/constants.ts`](src/lib/constants.ts) (los campos `escrow` / `mxnb` de la red a la que desplegaste).

### API de Bitso Business (Staging)

> ⚠️ **Usa el entorno de staging** — nunca el de producción para pruebas locales.

1. Crea una cuenta en [`stage.bitso.com`](https://stage.bitso.com)
2. Genera llaves de API en la configuración de la API
3. Agrega `BITSO_API_KEY` y `BITSO_API_SECRET` a tu `.env.local`

## 🧪 Pruebas y CI

**Pipeline de 6 etapas:** Calidad (lint/typecheck/jest en frontend + tests de hardhat en contratos) → Seguridad (TruffleHog + npm audit) → Verificación de Compilación y presupuesto de bundles → Playwright E2E → Rendimiento (Lighthouse CI) → Puerta de Despliegue (Deploy Gate)

```bash
# ── Calidad de Código y Pruebas Unitarias ──
npm run lint          # ESLint
npm run lint:fix      # Auto-corregir problemas de lint
npm run typecheck     # Verificación estricta de TypeScript
npm run test          # Ejecutar pruebas Jest
npm run test:coverage # Reporte de cobertura de Jest
npm run ci            # Pipeline de calidad completo (lint + typecheck + test:coverage)

# ── Calidad de Contratos Inteligentes ───────
cd contracts
npx hardhat compile   # Compilación de Hardhat
npx hardhat test      # Pruebas unitarias de contratos en Hardhat

# ── Pruebas E2E y Rendimiento Avanzadas ─────
npm run e2e           # Pruebas E2E de Playwright
npm run e2e:ui        # Interfaz interactiva de Playwright E2E
npm run lighthouse    # Auditoría de cumplimiento de Lighthouse CI
```

### Resumen del Harness de Ingeniería

| Capa | Herramienta | Estado | Detalles |
|---|---|---|---|
| **Calidad de Código** | ESLint + TypeScript | ✅ | Modo estricto, cero errores o advertencias |
| **Pruebas Unitarias** | Jest | ✅ | 32 suites, 150 pruebas, 100% de cobertura en líneas/ramas/funciones/declaraciones |
| **Pruebas de Contrato** | Hardhat + Chai | ✅ | 35 pruebas de contratos inteligentes exitosas (depósitos, contabilidad aislada, pagos automáticos, reembolsos sin confianza) |
| **Pruebas E2E** | Playwright | ✅ | 3 suites: pruebas de humo, responsividad móvil/tablet/desktop, flujo de creación de Tanda |
| **Seguridad (SAST)** | CodeQL | ✅ | Análisis de código estático automatizado en GitHub Actions |
| **Seguridad (SCA)** | Dependabot + Audit | ✅ | Escaneo de dependencias semanal y actualizaciones automatizadas |
| **Escaneo de Secretos** | TruffleHog | ✅ | Escaneo de secretos en el historial de commits en cada PR y push |
| **Rendimiento** | Lighthouse CI | ✅ | Configuración de presupuestos locales con ejecución de servidor automático |

## 📁 Estructura del Proyecto

```
tandot/
├── docs/              # Activos del README (hero, capturas de pantalla)
├── src/
│   ├── app/              # Páginas del App Router de Next.js 16
│   │   ├── page.tsx      # Página de inicio (hero bilingüe)
│   │   └── dashboard/    # Dashboard, vistas de detalle de tanda
│   ├── components/       # Componentes de React 19
│   └── lib/              # Tipos, constantes, datos simulados, clientes
├── db/
│   └── schema.sql        # Esquema de Supabase (tandas, miembros, contribuciones, pagos)
├── contracts/            # Contrato de escrow en Solidity
├── public/               # Icono, imagen OG
├── .env.example          # Plantilla de variables de entorno
├── .github/workflows/    # Pipeline de CI
├── README.md             # Versión en inglés
└── README.es.md          # Estás aquí

```

## 📄 Licencia

[MIT](LICENSE) © 2026 Edy Cu

## 🙏 Agradecimientos

Gracias a Bitso y BOT Chain por las APIs y herramientas.

¡Gracias por revisar este proyecto! 🇲🇽
