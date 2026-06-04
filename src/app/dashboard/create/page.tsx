'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PlusCircle, Users, DollarSign, Clock } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { useWallet } from '@/lib/WalletContext';
import { useSignMessage, useSwitchChain, useChainId } from 'wagmi';
import { BOT_CHAIN_ID } from '@/lib/constants';

export default function CreateTandaPage() {
  const { locale } = useLocale();
  const isEs = locale === 'es';
  const { address } = useWallet();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();

  const [name, setName] = useState(() => '');
  const [amount, setAmount] = useState(() => '');
  const [maxMembers, setMaxMembers] = useState(() => '');
  const [frequency, setFrequency] = useState(() => 'weekly');
  const [description, setDescription] = useState(() => '');
  const [submitting, setSubmitting] = useState(() => false);
  const [error, setError] = useState(() => '');

  const handleCreate = async () => { 
    setError('');
    if (!address) {
      alert(isEs ? 'Por favor conecta tu wallet primero.' : 'Please connect your wallet first.');
      return;
    }
    if (!name.trim() || Number(amount) <= 0 || Number(maxMembers) < 2) {
      setError(isEs
        ? 'Completa nombre, cuota (> 0) y al menos 2 miembros.'
        : 'Fill in a name, amount (> 0) and at least 2 members.');
      return;
    }

    setSubmitting(true); 
    try {
      if (chainId !== BOT_CHAIN_ID) {
        await switchChainAsync({ chainId: BOT_CHAIN_ID });
      }
      await signMessageAsync({
        message: 'Deploying TandaEscrow Contract on BOT Chain\n\nConfirming parameters and initializing AI Trust Matcher.',
      });

      const res = await fetch('/api/tandas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          contribution_amount: Number(amount),
          frequency,
          max_members: Number(maxMembers),
          creator_wallet: address,
          creator_name: `${address.slice(0, 6)}…${address.slice(-4)}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create tanda');

      window.location.href = `/dashboard/tandas/${data.tanda.id}`;
    } catch (err) {
      const code = (err as { code?: number })?.code;
      const errName = (err as { name?: string })?.name;
      if (errName === 'UserRejectedRequestError' || code === 4001) {
        return; // user declined the wallet prompt — benign
      }
      setError(err instanceof Error ? err.message : 'Failed to create tanda');
    } finally {
      setSubmitting(false);
    }
  };

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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              placeholder="10"
              className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) placeholder:text-(--text-low) focus:border-(--cyan-500) focus:outline-none transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text-mid) mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              {isEs ? 'Frecuencia' : 'Frequency'}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) focus:border-(--cyan-500) focus:outline-none transition-colors"
            >
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isEs ? 'Describe tu tanda para atraer miembros...' : 'Describe your tanda to attract members...'}
            className="w-full px-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) placeholder:text-(--text-low) focus:border-(--cyan-500) focus:outline-none transition-colors resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* Submit */}
        <button
          className="btn-primary w-full py-4 text-base font-semibold glow-cyan disabled:opacity-60 disabled:cursor-wait"
          disabled={submitting}
          onClick={handleCreate}
        >
          <PlusCircle className="w-5 h-5 mr-2 inline" />
          {submitting
            ? (isEs ? 'Creando…' : 'Creating…')
            : (isEs ? 'Crear Tanda con Escrow' : 'Create Tanda with Escrow')}
        </button>

        <p className="text-xs text-center text-(--text-low)">
          {isEs
            ? 'Se desplegará un contrato de escrow en BOT Chain automáticamente.'
            : 'An escrow contract will be deployed to BOT Chain automatically.'}
        </p>
      </GlassCard>
    </div>
  );
}
