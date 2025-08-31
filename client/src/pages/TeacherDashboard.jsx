import Layout from '../components/Layout';

export default function TeacherDashboard({ children }) {
  return (
    <Layout title="Teacher Dashboard" subtitle="Welcome back">
      <div className="space-y-6">
        {children}
      </div>
    </Layout>
  );
}