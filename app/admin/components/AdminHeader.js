'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiKey, FiExternalLink } from 'react-icons/fi';
import LogoutButton from '../LogoutButton';

export default function AdminHeader() {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') return null;

  return (
    <header className="admin-header-card">
      <div className="admin-header-brand">
        <h1 className="admin-header-title">
          Hasan Adenium
        </h1>
        <p className="admin-header-subtitle">
          Admin Dashboard
        </p>
      </div>
      
      <div className="admin-header-actions">
        <Link href="/admin/change-password" className="admin-header-btn admin-btn-secondary">
          <FiKey className="btn-icon" />
          <span>Password</span>
        </Link>
        <Link href="/" className="admin-header-btn admin-btn-primary">
          <FiExternalLink className="btn-icon" />
          <span>View Store</span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
