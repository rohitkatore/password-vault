'use client';

import { useState } from 'react';
import { useEncryption } from '@/contexts/EncryptionContext';
import { DecryptedVaultItem } from '@/types';
import { decryptVaultItem } from '@/lib/crypto';
import {
  exportVaultToJSON,
  exportVaultToCSV,
  downloadVaultFile,
  downloadCSVFile,
  readFileAsText,
  parseImportedVault,
  type ExportedVault
} from '@/lib/vault-export';

interface ExportImportModalProps {
  vaultItems: DecryptedVaultItem[];
  onImport: (items: DecryptedVaultItem[]) => void;
  onClose: () => void;
}

export default function ExportImportModal({ vaultItems, onImport, onClose }: ExportImportModalProps) {
  const { getEncryptionKey } = useEncryption();
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExportJSON = async () => {
    try {
      const key = getEncryptionKey();
      if (!key) {
        alert('Please unlock your vault first');
        return;
      }

      // Decrypt items before export
      const decryptedItems = vaultItems.map(item => {
        try {
          return decryptVaultItem(item, key);
        } catch {
          return null;
        }
      }).filter(item => item !== null);

      const jsonData = exportVaultToJSON(decryptedItems);
      downloadVaultFile(jsonData);

      alert(`âœ… Exported ${decryptedItems.length} items successfully!`);
    } catch {
      alert('Failed to export vault data');
    }
  };

  const handleExportCSV = async () => {
    try {
      const key = getEncryptionKey();
      if (!key) {
        alert('Please unlock your vault first');
        return;
      }

      // Decrypt items before export
      const decryptedItems = vaultItems.map(item => {
        try {
          return decryptVaultItem(item, key);
        } catch {
          return null;
        }
      }).filter(item => item !== null);

      const csvData = exportVaultToCSV(decryptedItems);
      downloadCSVFile(csvData);

      alert(`âœ… Exported ${decryptedItems.length} items to CSV successfully!`);
    } catch {
      alert('Failed to export vault data');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      const key = getEncryptionKey();
      if (!key) {
        throw new Error('Please unlock your vault first');
      }

      // Read file
      const fileContent = await readFileAsText(file);

      // Parse vault data
      const importedVault: ExportedVault = parseImportedVault(fileContent);

      if (importedVault.items.length === 0) {
        throw new Error('No items found in import file');
      }

      // Pass decrypted items to parent for re-encryption and upload
      onImport(importedVault.items);

      setImportSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setImportError((error as Error).message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            ðŸ“¦ Export / Import Vault
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-3 font-medium ${activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            ðŸ“¤ Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-3 font-medium ${activeTab === 'import'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            ðŸ“¥ Import
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  â„¹ï¸ Your vault data will be decrypted and exported. Keep the exported file secure!
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  <strong>Items to export:</strong> {vaultItems.length}
                </div>

                <button
                  onClick={handleExportJSON}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export as JSON
                </button>

                <button
                  onClick={handleExportCSV}
                  className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export as CSV
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  âš ï¸ <strong>Security Warning:</strong> Exported files contain unencrypted passwords.
                  Store them securely and delete after use.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  â„¹ï¸ Import vault data from a JSON file exported from this application.
                </p>
              </div>

              {importError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    âŒ {importError}
                  </p>
                </div>
              )}

              {importSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    âœ… Import successful! Items are being added to your vault...
                  </p>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={importing}
                  className="hidden"
                />
                <label
                  htmlFor="import-file"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="text-center">
                    <span className="text-blue-600 font-semibold">
                      {importing ? 'Importing...' : 'Click to select file'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      JSON files only
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  âš ï¸ <strong>Note:</strong> Imported items will be encrypted with your current master password
                  and added to your vault. Existing items will not be affected.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

