import { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';

export const metadata: Metadata = {
  title: 'Next-GenAI CBMS | Construction Business Management System',
  description: 'AI-powered construction business management with smart call screening, project estimation, and real-time pricing catalogs',
};

export default function Home() {
  return <Dashboard />;
}