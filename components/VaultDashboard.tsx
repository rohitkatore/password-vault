'use client';

import { useState, useEffect } from 'react';
import { useEncryption } from '@/contexts/EncryptionContext';
import { signOut } from '@/lib/auth-helpers';
import { encryptVaultItem } from '@/lib/crypto';
import { DecryptedVaultItem, VaultItemCreateData } from '@/types';
import MasterPasswordPrompt from './MasterPasswordPrompt';
import VaultItemCard from './VaultItemCard';
import VaultItemForm from './VaultItemForm';
import ExportImportModal from './ExportImportModal';
import ThemeToggle from './ThemeToggle';

interface VaultDashboardProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export default function VaultDashboard({ user }: VaultDashboardProps) {
  const { hasKey, setupEncryptionKey, clearEncryptionKey, getEncryptionKey } = useEncryption();
  const [showMasterPasswordPrompt, setShowMasterPasswordPrompt] = useState(false);
  const [vaultItems, setVaultItems] = useState<DecryptedVaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedVaultItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportImport, setShowExportImport] = useState(false);

  useEffect(() => {
    // Show master password prompt if no encryption key is set
    if (!hasKey) {
      setShowMasterPasswordPrompt(true);
    } else {
      // Load vault items when unlocked
      fetchVaultItems();
    }
  }, [hasKey]);

  const fetchVaultItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/vault');
      if (!response.ok) {
        throw new Error('Failed to fetch vault items');
      }

      const data = await response.json();
      setVaultItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vault items');
    } finally {
      setLoading(false);
    }
  };

  const handleMasterPasswordSubmit = (masterPassword: string) => {
    const success = setupEncryptionKey(masterPassword, user.email);
    if (success) {
      setShowMasterPasswordPrompt(false);
    } else {
      alert('Failed to setup encryption key. Please try again.');
    }
  };

  const handleSignOut = async () => {
    clearEncryptionKey();
    await signOut();
  };

  const handleLockVault = () => {
    clearEncryptionKey();
    setShowMasterPasswordPrompt(true);
    setVaultItems([]);
  };

  const handleAddItem = async (encryptedData: VaultItemCreateData) => {
    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encryptedData),
      });

      if (!response.ok) {
        throw new Error('Failed to create vault item');
      }

      setShowAddForm(false);
      await fetchVaultItems();
    } catch (err) {
      throw err; // Re-throw to be handled by form
    }
  };

  const handleUpdateItem = async (encryptedData: VaultItemCreateData) => {
    try {
      const response = await fetch(`/api/vault/${editingItem?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encryptedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update vault item');
      }

      setEditingItem(null);
      await fetchVaultItems();
    } catch (err) {
      throw err; // Re-throw to be handled by form
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vault item');
      }

      await fetchVaultItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleEditItem = (item: DecryptedVaultItem) => {
    setEditingItem(item);
    setShowAddForm(false);
  };

  const handleImportItems = async (items: DecryptedVaultItem[]) => {
    try {
      const key = getEncryptionKey();
      if (!key) {
        throw new Error('Encryption key not available');
      }

      // Encrypt and upload each item
      for (const item of items) {
        const encryptedData = encryptVaultItem(item, key);
        await fetch('/api/vault', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(encryptedData),
        });
      }

      // Refresh vault items
      await fetchVaultItems();
      setShowExportImport(false);
    } catch (err) {
      throw err;
    }
  };

  const filteredItems = vaultItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Master Password Prompt */}
      {showMasterPasswordPrompt && (
        <MasterPasswordPrompt
          email={user.email}
          onSubmit={handleMasterPasswordSubmit}
          onCancel={() => handleSignOut()}
        />
      )}

      {/* Main Content */}
      {!showMasterPasswordPrompt && (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🔐 Password Vault
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user.name || user.email}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${hasKey ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  ></span>
                  <span className="text-sm font-medium text-gray-700">
                    {hasKey ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <ThemeToggle />
                {hasKey && (
                  <>
                    <button
                      onClick={() => setShowExportImport(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                      title="Export/Import Vault"
                    >
                      📦
                    </button>
                    <button
                      onClick={handleLockVault}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
                    >
                      🔒 Lock
                    </button>
                  </>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">⚠️ {error}</p>
            </div>
          )}

          {/* Add/Edit Form */}
          {(showAddForm || editingItem) && (
            <div className="mb-6">
              <VaultItemForm
                onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                initialData={editingItem ? {
                  title: editingItem.title,
                  username: editingItem.username || '',
                  password: editingItem.password || '',
                  url: editingItem.url || '',
                  notes: editingItem.notes || ''
                } : undefined}
                isEdit={!!editingItem}
              />
            </div>
          )}

          {/* Actions Bar */}
          {!showAddForm && !editingItem && (
            <div className="mb-6 flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search vault items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                ➕ Add New Item
              </button>
            </div>
          )}

          {/* Vault Items */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading vault items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No items found' : 'Your vault is empty'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start by adding your first password'}
              </p>
              {!searchQuery && !showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  ➕ Add Your First Item
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredItems.map((item) => (
                <VaultItemCard
                  key={item._id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}

          {/* Stats */}
          {!loading && vaultItems.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {vaultItems.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {filteredItems.length}
                  </div>
                  <div className="text-sm text-gray-600">Visible</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    🔐
                  </div>
                  <div className="text-sm text-gray-600">Encrypted</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export/Import Modal */}
      {showExportImport && (
        <ExportImportModal
          vaultItems={vaultItems}
          onImport={handleImportItems}
          onClose={() => setShowExportImport(false)}
        />
      )}
    </div>
  );
}
