import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import VaultDashboard from '../../components/VaultDashboard';

export default async function VaultPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <VaultDashboard user={session.user} />
        </div>
    );
}
