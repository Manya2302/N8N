import Layout from '../components/Layout';

export default function AdminDashboard({ children }) {
  return (
    <Layout title="Admin Dashboard" subtitle="School Management System">
      <div className="space-y-6">
        {children}
      </div>
    </Layout>
  );
}