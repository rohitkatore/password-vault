import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to vault
  if (session) {
    redirect('/vault');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            🔐 Password Vault
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Secure Password Generator & Encrypted Vault
          </p>
          <p className="text-sm text-gray-500">
            Your passwords, encrypted and secure with client-side encryption
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Client-Side Encryption
            </h3>
            <p className="text-sm text-gray-600">
              Your data is encrypted in your browser before reaching our servers
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-3">🎲</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Password Generator
            </h3>
            <p className="text-sm text-gray-600">
              Generate strong, customizable passwords with one click
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Secure Storage
            </h3>
            <p className="text-sm text-gray-600">
              Store all your passwords securely in your personal vault
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 text-base font-medium rounded-lg text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-12 text-xs text-gray-500">
          <p>🔒 End-to-end encrypted • 🔐 Zero-knowledge architecture • 🛡️ Open source</p>
        </div>
      </main>
    </div>
  );
}
