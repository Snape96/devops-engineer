import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FunctionComponent,
} from 'react';
import { useSession } from 'next-auth/react';
import { getProfile } from '@/actions/strapi/requests/getProfile';
import { UserIdentity } from '@/actions/strapi/requests/gql/LIST_USER_IDENTITES';

// Defines the shape of the Identity Context's value.
export interface IdentityContextProps {
  userProfile: UserIdentity | null; // The user's profile data.
  isLoading: boolean; // Loading state of the profile fetch operation.
}

// Creates a context for storing and accessing the user's identity (profile) information.
const IdentityContext = createContext<IdentityContextProps | null>(null);

/**
 * Custom hook to provide easy access to identity (user profile) data.
 * @returns {IdentityContextProps | null} The user's profile data and loading state.
 */
export const useIdentity = (): IdentityContextProps | null => {
  return useContext(IdentityContext);
};

/**
 * This provider component fetches and provides the user's identity (profile) information to its child components.
 * It uses the next-auth session to get the user's email and fetches the profile data based on it.
 *
 * @param {Object} props - Standard React component props.
 */
export const IdentityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserIdentity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session && session.user?.email) {
        if (!userProfile) setIsLoading(true);
        console.log('identity context fetch for ', session.user?.email);
        const profileResponse: UserIdentity | undefined = await getProfile(
          session.user?.email as string
        );
        setUserProfile(profileResponse ?? null); // Ensure proper type mapping here.
        setIsLoading(false);
      } else {
        setUserProfile(null);
      }
    };
    console.log('identity context change');
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, session?.user?.email]);

  return (
    <IdentityContext.Provider value={{ userProfile, isLoading }}>
      {children}
    </IdentityContext.Provider>
  );
};
