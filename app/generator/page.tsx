import { Metadata } from 'next';
import PasswordGenerator from '@/components/PasswordGenerator';

export const metadata: Metadata = {
    title: 'Password Generator | Password Vault',
    description: 'Generate strong, secure passwords with customizable options',
};

export default function PasswordGeneratorPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <PasswordGenerator />
            </div>
        </div>
    );
}
