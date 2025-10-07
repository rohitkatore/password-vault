/**
 * Vault Export/Import Utilities
 * Export and import encrypted vault data
 */

import { DecryptedVaultItem } from '@/types';

export interface ExportedVault {
  version: string;
  exportedAt: string;
  items: DecryptedVaultItem[];
  itemCount: number;
}

/**
 * Export vault items to JSON
 */
export function exportVaultToJSON(items: DecryptedVaultItem[]): string {
  const exportData: ExportedVault = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    items: items.map(item => ({
      _id: item._id,
      userId: item.userId,
      title: item.title,
      username: item.username,
      password: item.password,
      url: item.url,
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    })),
    itemCount: items.length
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download vault data as a file
 */
export function downloadVaultFile(jsonData: string, filename?: string) {
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename || `vault-export-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse imported vault JSON
 */
export function parseImportedVault(jsonString: string): ExportedVault {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (!data.version || !data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid vault export format');
    }

    return data as ExportedVault;
  } catch (error) {
    throw new Error('Failed to parse vault file: ' + (error as Error).message);
  }
}

/**
 * Read file contents
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Export vault to encrypted CSV format
 */
export function exportVaultToCSV(items: DecryptedVaultItem[]): string {
  const headers = ['Title', 'Username', 'Password', 'URL', 'Notes', 'Created', 'Updated'];
  const rows = items.map(item => [
    item.title,
    item.username || '',
    item.password || '',
    item.url || '',
    item.notes || '',
    new Date(item.createdAt).toLocaleString(),
    new Date(item.updatedAt).toLocaleString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSVFile(csvData: string, filename?: string) {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename || `vault-export-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
