'use client';

import { useEffect, useState } from 'react';
import { analyzePasswordStrength, estimateCrackTime, type PasswordStrength } from '@/lib/password-strength';

interface PasswordStrengthMeterProps {
  password: string;
  showDetails?: boolean;
}

export default function PasswordStrengthMeter({
  password,
  showDetails = false
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [crackTime, setCrackTime] = useState<string>('');

  useEffect(() => {
    if (!password) {
      setStrength(null);
      setCrackTime('');
      return;
    }

    const analysis = analyzePasswordStrength(password);
    setStrength(analysis);
    setCrackTime(estimateCrackTime(password));
  }, [password]);

  if (!password || !strength) {
    return null;
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-red-700';
      case 'orange':
        return 'bg-orange-500 text-orange-700';
      case 'yellow':
        return 'bg-yellow-500 text-yellow-700';
      case 'green':
        return 'bg-green-500 text-green-700';
      default:
        return 'bg-gray-500 text-gray-700';
    }
  };

  const widthPercentage = ((strength.score + 1) / 5) * 100;

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getColorClasses(strength.color).split(' ')[0]}`}
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${getColorClasses(strength.color).split(' ').slice(1).join(' ')}`}>
          {strength.label}
        </span>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-2">
          {/* Crack Time */}
          <div className="text-xs text-gray-600">
            ⏱️ Time to crack: <span className="font-semibold">{crackTime}</span>
          </div>

          {/* Checks */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-1 ${strength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
              {strength.checks.length ? '✅' : '⬜'} 12+ characters
            </div>
            <div className={`flex items-center gap-1 ${strength.checks.uppercase && strength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
              {strength.checks.uppercase && strength.checks.lowercase ? '✅' : '⬜'} Mixed case
            </div>
            <div className={`flex items-center gap-1 ${strength.checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
              {strength.checks.numbers ? '✅' : '⬜'} Numbers
            </div>
            <div className={`flex items-center gap-1 ${strength.checks.symbols ? 'text-green-600' : 'text-gray-400'}`}>
              {strength.checks.symbols ? '✅' : '⬜'} Symbols
            </div>
          </div>

          {/* Suggestions */}
          {strength.suggestions.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
              <div className="font-semibold text-yellow-800 mb-1">
                💡 Suggestions:
              </div>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                {strength.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
