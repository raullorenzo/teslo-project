export const revalidate = 0;

import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';
import { User } from '@/interfaces';
import { auth } from '@/auth.config';

export default async function UsersAdminPage() {
  const session = await auth();

  // obtener mi usuario
  const user = session?.user;
  console.log(user?.email);
  

  const { ok, users = [] } = await getPaginatedUsers();

  // eliminar mi usuario de la lista de usuarios
  const filteredUsers = users.filter((u: User) => u.email !== user?.email);

  // Calcular total paginas si en cada pagina se muestran 10 usuarios
  const totalPages = Math.ceil(filteredUsers.length / 10);

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Registered users" />

      <div className="mb-10">
        <UsersTable users={filteredUsers} />

        {/* // TODO: Implementar paginación */}
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}