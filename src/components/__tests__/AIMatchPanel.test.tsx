import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AIMatchPanel, FactorBar } from '../AIMatchPanel';
import { TrendingUp } from 'lucide-react';

describe('AIMatchPanel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders initial state and advances logs through setInterval', () => {
    render(<AIMatchPanel memberId="0x1234...5678" score={85} />);
    
    // Initial state
    expect(screen.getByText('Initializing neural analysis...')).toBeInTheDocument();
    
    // Advance timers to trigger the first interval (800ms)
    act(() => {
      jest.advanceTimersByTime(800);
    });
    
    // First log should appear
    expect(screen.getByText('Analizando billetera: 0x1234...5678')).toBeInTheDocument();
    
    // Advance remaining timers to complete all logs (7 logs * 800ms = 5600ms)
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    
    // Final log should appear and scanning should be finished
    expect(screen.getByText('Puntuación generada: 85/100')).toBeInTheDocument();
    
    // Advance one more time to trigger the else branch that clears interval
    act(() => {
      jest.advanceTimersByTime(800);
    });
    
    // The "Initializing neural analysis..." text should be gone
    expect(screen.queryByText('Initializing neural analysis...')).not.toBeInTheDocument();
  });

  it('handles empty memberId', () => {
    render(<AIMatchPanel score={45} />);
    
    act(() => {
      jest.advanceTimersByTime(800);
    });
    
    expect(screen.getByText('Analizando billetera: 0x...')).toBeInTheDocument();
  });

  describe('FactorBar', () => {
    it('renders correctly with different values and inverse flag', () => {
      const { rerender } = render(<FactorBar icon={TrendingUp} label="Test" value={90} />);
      expect(screen.getByText('90%')).toBeInTheDocument();
      
      // Test value > 60 <= 80 (cyan-500)
      rerender(<FactorBar icon={TrendingUp} label="Test" value={70} />);
      expect(screen.getByText('70%')).toBeInTheDocument();

      // Test value <= 60 (amber-500)
      rerender(<FactorBar icon={TrendingUp} label="Test" value={50} />);
      expect(screen.getByText('50%')).toBeInTheDocument();

      // Test inverse value > 40 (red-500)
      rerender(<FactorBar icon={TrendingUp} label="Test" value={50} inverse />);
      expect(screen.getByText('50%')).toBeInTheDocument();

      // Test inverse value <= 40 (emerald-500)
      rerender(<FactorBar icon={TrendingUp} label="Test" value={30} inverse />);
      expect(screen.getByText('30%')).toBeInTheDocument();
    });
  });
});
