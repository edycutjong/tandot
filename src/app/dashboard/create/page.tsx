'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PlusCircle, Users, DollarSign, Clock } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { useWallet } from '@/lib/WalletContext';
import { useSignMessage } from 'wagmi';

export default function CreateTandaPage() {
  const { locale } = useLocale();
  const isEs = locale === 'es';
  const { address } = useWallet();
  const { signMessageAsync } = useSignMessage();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading font-bold text-3xl text-(--text-hi) mb-2">
        <PlusCircle className="w-8 h-8 inline mr-3 text-(--cyan-400)" />
        {isEs ? 'Crear Nueva Tanda' : 'Create New Tanda'}
      </h1>
      <p className="text-(--text-mid) mb-8">
        {isEs
          ? 'Configura los parámetros de tu tanda y la IA encontrará miembros compatibles.'
          : 'Configure your tanda parameters and AI will find compatible members.'}
      </p>

      <GlassCard className="p-8 space-y-6">
        {/* Tanda Name */}
        <div>
          <label className="block text-sm font-medium text-(--text-mid) mb-2">
            {isEs ? 'Nombre de la Tanda' : 'Tanda Name'}
          </label>
          <input
            type="text"
            placeholder={isEs ? 'ej. Tanda Navideña 2026' : 'e.g. Holiday Tanda 2026'}
            className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) placeholder:text-(--text-low) focus:border-(--cyan-500) focus:outline-none transition-colors"
          />
        </div>

        {/* Contribution Amount */}
        <div>
          <label className="block text-sm font-medium text-(--text-mid) mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            {isEs ? 'Cuota por Ronda (MXNB)' : 'Contribution per Round (MXNB)'}
          </label>
          <input
            type="number"
            placeholder="1,000"
            className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) placeholder:text-(--text-low) focus:border-(--cyan-500) focus:outline-none transition-colors font-mono"
          />
        </div>

        {/* Members & Rounds */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--text-mid) mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              {isEs ? 'Máx. Miembros' : 'Max Members'}
            </label>
            <input
              type="number"
              placeholder="10"
              className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) placeholder:text-(--text-low) focus:border-(--cyan-500) focus:outline-none transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text-mid) mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              {isEs ? 'Frecuencia' : 'Frequency'}
            </label>
            <select className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) focus:border-(--cyan-500) focus:outline-none transition-colors">
              <option value="weekly">{isEs ? 'Semanal' : 'Weekly'}</option>
              <option value="biweekly">{isEs ? 'Quincenal' : 'Biweekly'}</option>
              <option value="monthly">{isEs ? 'Mensual' : 'Monthly'}</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-(--text-mid) mb-2">
            {isEs ? 'Descripción' : 'Description'}
          </label>
          <textarea
            rows={3}
            placeholder={isEs ? 'Describe tu tanda para atraer miembros...' : 'Describe your tanda to attract members...'}
            className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) placeholder:text-(--text-low) focus:border-(--cyan-500) focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button 
          className="btn-primary w-full py-4 text-base font-semibold glow-cyan"
          onClick={async () => {
            try {
              if (address) {
                await signMessageAsync({
                  message: 'Deploying TandaEscrow Contract on BOT Chain Testnet\n\nConfirming parameters and initializing AI Trust Matcher.'
                });
                window.location.href = '/dashboard';
              } else {
                alert(isEs ? 'Por favor conecta tu wallet primero.' : 'Please connect your wallet first.');
              }
            } catch (error) {
              console.error('Transaction rejected', error);
            }
          }}
        >
          <PlusCircle className="w-5 h-5 mr-2 inline" />
          {isEs ? 'Crear Tanda con Escrow' : 'Create Tanda with Escrow'}
        </button>

        <p className="text-xs text-center text-(--text-low)">
          {isEs
            ? 'Se desplegará un contrato de escrow en BOT Chain Testnet automáticamente.'
            : 'An escrow contract will be deployed to BOT Chain Testnet automatically.'}
        </p>
      </GlassCard>
    </div>
  );
}
