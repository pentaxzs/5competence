import { notFound } from 'next/navigation';
import { getRoleById } from '@/data/competencies';
import RoleApp from './RoleApp';

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const roleData = getRoleById(role);
  if (!roleData) notFound();
  return <RoleApp role={roleData} />;
}
