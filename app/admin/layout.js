import AdminHeader from './components/AdminHeader';

export const metadata = {
  title: 'Hasan Adenium Admin',
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <div className="admin-layout-container">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
