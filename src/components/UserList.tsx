/**
 * UserList.tsx - User listing component
 * This component is responsible for displaying a list of users with controls for each user.
 * The controls include toggling user access and admin status.
 */
import { useAdminContext } from './contexts/admin/AdminContext';
import { deleteUserIdentity } from '@/actions/strapi/requests/deleteUserIdentity';
import { useIdentity } from './contexts/auth/IdentityContext';
import Loader from './Loader';
import { UserIdentity } from '@/actions/strapi/requests/gql/LIST_USER_IDENTITES';
import { updateUserIdentity } from '@/actions/strapi/requests/updateUserIdentity';
import styled from 'styled-components';
import Button from './Button';
import Pagination from './Pagination';

/**
 * Functional component to render the list of users
 */
const UserList = () => {
  const { users, usersLoading, fetchUsers } = useAdminContext();
  const identity = useIdentity();

  const deleteUser = async (user: UserIdentity) => {
    if (user.attributes.has_access || user.attributes.is_admin) {
      alert('Can only delete profile without access and admin privileges');
      return;
    }

    const res = await deleteUserIdentity(user.id);

    console.log('Deleted user ', res);

    await fetchUsers(new Date().getFullYear(), new Date().getMonth() + 1, true);
  };

  const toggleAccess = async (user: UserIdentity) => {
    if (user.id === identity?.userProfile?.id) {
      alert('Cannot modify yourself');
      return;
    }

    const res = await updateUserIdentity(
      user.id,
      user.attributes.is_admin,
      !user.attributes.has_access,
      user.attributes.email
    );

    console.log(res);

    await fetchUsers(new Date().getFullYear(), new Date().getMonth() + 1, true);
  };

  const toggleAdmin = async (user: UserIdentity) => {
    if (user.id === identity?.userProfile?.id) {
      alert('Cannot modify yourself');
      return;
    }

    const res = await updateUserIdentity(
      user.id,
      !user.attributes.is_admin,
      user.attributes.has_access,
      user.attributes.email
    );

    console.log(res);

    await fetchUsers(new Date().getFullYear(), new Date().getMonth() + 1, true);
  };

  return (
    <UserListContainer>
      {/* Looping through all users to display them */}
      {usersLoading ? (
        <Loader size='lg' />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Spending</th>
                <th>Is admin?</th>
                <th>Has access?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id}>
                  {/* Show user information and control buttons */}
                  <td>{user.attributes.email}</td>
                  <td>
                    {`$${
                      user.attributes.user_usage_statistics.data[0]?.attributes.budget_spent.toFixed(
                        3
                      ) ?? '0.000'
                    }`}
                  </td>
                  <td>
                    <PermissionGroup>
                      <Label $yes={user.attributes.is_admin}>
                        {user.attributes.is_admin ? 'Yes' : 'No'}
                      </Label>
                      <Button type='button' onClick={() => toggleAdmin(user)}>
                        {user.attributes.is_admin ? 'Disable' : 'Enable'}
                      </Button>
                    </PermissionGroup>
                  </td>
                  <td>
                    <PermissionGroup>
                      <Label $yes={user.attributes.has_access}>
                        {user.attributes.has_access ? 'Yes' : 'No'}
                      </Label>
                      <Button type='button' onClick={() => toggleAccess(user)}>
                        {user.attributes.has_access ? 'Revoke' : 'Grant'}
                      </Button>
                    </PermissionGroup>
                  </td>
                  <td>
                    <PermissionGroup>
                      <Button
                        type='button'
                        onClick={async () => await deleteUser(user)}
                        disabled={user.id === identity?.userProfile?.id}
                      >
                        Delete
                      </Button>
                    </PermissionGroup>
                  </td>
                </UserRow>
              ))}
            </tbody>
          </Table>
          <Pagination
            page={1}
            total={1}
            onPageRequested={(page) => {
              alert('TODO implement pagination');
              console.log(page);
            }}
          />
        </>
      )}
    </UserListContainer>
  );
};

export default UserList;

const UserListContainer = styled.div`
  width: 100%;

  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;

  border-collapse: collapse;

  th {
    padding: 8px 16px;

    border-bottom: 1px solid ${(props) => props.theme.primary};
    color: ${(props) => props.theme.primary};
    text-align: left;
  }
`;

const UserRow = styled.tr`
  td {
    padding: 8px 16px;

    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 1.6rem;
  }
`;

const PermissionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${Button} {
    padding: 4px 12px;

    font-size: 1.4rem;
  }
`;

const Label = styled.span<{ $yes?: boolean }>`
  width: 5rem;

  padding: 4px 12px;

  background-color: ${(props) =>
    props.$yes ? props.theme.accent : 'rgba(0, 0, 0, .1)'};
  border-radius: 5px;
  color: ${(props) => props.theme.primary};
  font-size: 1.4rem;
  text-align: center;
`;
