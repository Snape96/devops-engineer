import { useEffect, useState, useCallback, Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useChatHistoriesContext } from './contexts/portal/data/ChatHistoriesContext';
import { ListChatHistoryData } from '@/actions/strapi/requests/gql/LIST_CHAT_HISTORIES';
import {
  getDateOnlyFromDateTime,
  getOneWeekLimit,
  getTodaysDate,
  getYesterdayLimit,
} from '@/helpers/date';
import { useSession } from 'next-auth/react';
import Button from './Button';
import { Message } from './Icons/Message';
import { MessageFill } from './Icons/MessageFill';
import { Add } from './Icons/Add';
import { Dots } from './Icons/Dots';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useIdentity } from './contexts/auth/IdentityContext';
import { updateChatHistoryDelete } from '@/actions/strapi/requests/updateChatHistoryDelete';
import { Cross } from './Icons/Cross';
import { MessageShared } from './Icons/MessageShared';
import { Menu } from './Icons/Menu';
import { MessageSharedFill } from './Icons/MessageSharedFill';
import { CncLogoWhite } from './Icons/CncLogoWhite';

type ChatHistoryCategories = {
  [category: string]: ListChatHistoryData[];
};

/**
 * LeftMenu Component
 * This component renders the chat history menu allowing users to navigate different chat histories.
 */
export const LeftMenu = () => {
  const router = useRouter(); // Initializing the router
  const session = useSession();
  const { chatHistories, loading, refreshChatHistories } =
    useChatHistoriesContext();
  const identity = useIdentity();
  const [chatHistoryCategories, setChatHistoryCategories] =
    useState<ChatHistoryCategories>({});

  // default view: >1200px visible, <=1200 hidden
  const [invertView, setInvertView] = useState(false);
  useEffect(() => {
    const callback = (e: MouseEvent) => {
      if (
        !!(e.target as HTMLElement).closest(
          MobileButton as unknown as string
        ) ||
        !!(e.target as HTMLElement).closest(Content as unknown as string) ||
        window.innerWidth > 500
      )
        return;

      setInvertView(false);
    };

    document.addEventListener('click', callback);

    return () => {
      document.removeEventListener('click', callback);
    };
  }, [invertView]);

  // settings menu handling
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (settingsOpen) {
      const callback = (e: MouseEvent) => {
        if (
          !(e.target as HTMLElement).closest(
            SettingsButton as unknown as string
          ) &&
          !(e.target as HTMLElement).closest(SettingsMenu as unknown as string)
        )
          setSettingsOpen(false);
      };
      document.addEventListener('click', callback);

      return () => {
        document.removeEventListener('click', callback);
      };
    }
  }, [settingsOpen]);

  // useEffect for grouping chat histories into categories
  useEffect(() => {
    if (!loading) {
      const categorizedHistories = splitHistoryIntoCategories(chatHistories);
      setChatHistoryCategories(categorizedHistories);
    }
  }, [chatHistories, loading]);

  // Function to split chat histories into categories based on their dates
  const splitHistoryIntoCategories = (data: ListChatHistoryData[]) => {
    const categories: ChatHistoryCategories = {};
    const today = getTodaysDate();
    const yesterdayLimit = getYesterdayLimit();
    const oneWeekLimit = getOneWeekLimit();

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const date = getDateOnlyFromDateTime(element.attributes.createdAt);

      if (date >= today) {
        categories['Today'] = [...(categories['Today'] || []), element];
      } else if (date >= yesterdayLimit) {
        categories['Yesterday'] = [...(categories['Yesterday'] || []), element];
      } else if (date >= oneWeekLimit) {
        categories['This Week'] = [...(categories['This Week'] || []), element];
      } else {
        categories['Older'] = [...(categories['Older'] || []), element];
      }
    }

    return categories;
  };

  // sign out
  const handleSignOut = async () => {
    await signOut();
  };

  const handleDelete = async (id: string) => {
    await updateChatHistoryDelete(id);
    await refreshChatHistories();

    if (router.route === `/chat/[id]` && router.query.id === id) {
      router.push('/chat');
    } else {
      console.log(router.route);
    }
  };

  return (
    <>
      <Logo>
        <CncLogoWhite /> <span>Chat GPT</span>
      </Logo>
      <Wrapper $invertView={invertView}>
        <MobileButton
          $invertView={invertView}
          onClick={() => {
            setInvertView((value) => !value);
          }}
        >
          <Menu />
        </MobileButton>
        <Content>
          <Cta>
            <Link href={`/chat`}>
              <Button inverted type='button' tabIndex={-1}>
                <Add /> New chat
              </Button>
            </Link>
          </Cta>
          {/* Iterating over categories to display menu items */}
          <Categories>
            {Object.keys(chatHistoryCategories).map((key) => (
              <Fragment key={key}>
                <Category>{key}</Category>
                <Items>
                  {/* Iterating over items within a category */}
                  {chatHistoryCategories[key].map((item) => (
                    <Item
                      key={item.id}
                      selected={router.asPath === `/chat/${item.id}`}
                      title={
                        item.attributes.shared_by
                          ? `Shared by: ${item.attributes.shared_by}`
                          : undefined
                      }
                    >
                      <Link href={`/chat/${item.id}`}>
                        {router.asPath === `/chat/${item.id}` ? (
                          item.attributes.shared_by ? (
                            <MessageSharedFill />
                          ) : (
                            <MessageFill />
                          )
                        ) : item.attributes.shared_by ? (
                          <MessageShared />
                        ) : (
                          <Message />
                        )}
                        {/* Render item name */}
                        {item.attributes.name}
                      </Link>
                      <DeleteButton
                        onClick={async () => await handleDelete(item.id)}
                      >
                        <Cross />
                      </DeleteButton>
                    </Item>
                  ))}
                </Items>
              </Fragment>
            ))}
          </Categories>
          <Hr />
          <UserInfoStyle>
            <UserPhoto
              src={session.data?.user?.image as string}
              alt='User Photo'
            />
            <UserName>{session.data?.user?.name}</UserName>
            <SettingsButton
              type='button'
              ref={settingsButtonRef}
              onClick={() => {
                setSettingsOpen(!settingsOpen);
              }}
            >
              <Dots />
            </SettingsButton>
            <SettingsMenu open={settingsOpen}>
              {identity?.userProfile?.attributes.is_admin && (
                <Link href='/admin'>
                  <SettingsMenuItem>Admin</SettingsMenuItem>
                </Link>
              )}
              <button onClick={handleSignOut}>
                <SettingsMenuItem>Logout</SettingsMenuItem>
              </button>
            </SettingsMenu>
          </UserInfoStyle>
        </Content>
      </Wrapper>
    </>
  );
};

const Logo = styled.div`
  display: none;

  @media (max-width: 1200px) {
    position: fixed;
    z-index: 0;

    top: 0;
    left: 0;

    display: flex;
    align-items: center;

    width: 100vw;
    height: 48px;

    padding: 8px 12px;

    background-color: ${(props) => props.theme.primary};
    color: #fff;

    svg {
      height: 30px;
    }

    span {
      align-self: flex-end;

      line-height: 1;

      margin-left: -8px;
    }
  }
`;

const Wrapper = styled.div<{ $invertView: boolean }>`
  flex-shrink: 0;

  position: relative;
  z-index: 999;

  margin-left: ${(props) => (props.$invertView ? '-264px' : '0')};

  background: ${(props) => props.theme.primary};
  color: #ffffff;

  transition: all 0.3s ease-out;

  > * {
    transition: opacity 0.2s ease-out;
  }

  ${(props) =>
    props.$invertView
      ? `
    > * {
      opacity: 0;
      pointer-events: none;
    }
  `
      : ''}

  a {
    text-decoration: none;

    > button {
      width: 100%;
    }
  }

  &:before {
    content: '';
    position: fixed;
    z-index: 100;

    top: 0;
    bottom: 0;
    left: 100%;

    width: 100vw;

    pointer-events: none;
    transition: all 0.3s ease-out;
  }

  @media (max-width: 1200px) {
    margin-left: -320px;

    box-shadow: ${(props) =>
      props.$invertView ? '0 0 15px 0 rgba(0, 0, 0, .5)' : 'none'};

    transform: translateX(${(props) => (props.$invertView ? '320px' : '0')});

    &:before {
      background-color: ${(props) =>
        props.$invertView ? 'rgba(0, 0, 0, .25)' : 'transparent'};
      backdrop-filter: ${(props) =>
        props.$invertView ? 'blur(2px)' : 'blur(0)'};
      pointer-events: ${(props) => (props.$invertView ? 'initial' : 'none')};
    }

    ${(props) =>
      props.$invertView
        ? `
      > * {
        opacity: 1;
        pointer-events: initial;
      }
    `
        : ''}
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  width: 320px;
  height: 100%;

  padding: 32px;

  overflow-y: auto;
`;

const Cta = styled.div`
  position: relative;

  padding-right: 56px;

  > :first-child {
    flex-grow: 1;
  }
`;

const MobileButton = styled.button<{ $invertView: boolean }>`
  position: absolute;
  z-index: 101;

  top: 32px;
  right: 32px;

  width: 48px;
  height: 44px;

  margin: 0;
  margin-right: -8px;
  padding: 8px;

  background-color: ${(props) => props.theme.primary};
  border: none;
  border-radius: 5px;
  color: ${(props) => props.theme.accent};

  cursor: pointer;
  opacity: 1;
  pointer-events: initial;

  &:hover {
    outline: 2px solid #fff;
  }

  ${(props) =>
    props.$invertView
      ? `
        right: 12px;
        `
      : ''}

  @media (max-width: 1200px) {
    ${(props) =>
      !props.$invertView
        ? `
          position: fixed;

          display: block;

          top: 0;
          right: calc(-100vw + 16px);

          height: 48px;
        `
        : `
          right: 32px;
        `}
  }
`;

const Categories = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;

  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
`;

const Category = styled.h2`
  margin: 0;

  font-size: 1.8rem;
  font-weight: 500;

  ul + & {
    margin-top: 12px;
  }
`;

const Items = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;

  margin: 0;
  padding: 0;

  list-style: none;
`;

const Item = styled.li<{ selected?: boolean }>`
  position: relative;

  a {
    display: flex;
    gap: 8px;
    align-items: center;

    margin: 0 -16px;
    padding: 8px 16px;

    color: #ffffff;
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: 400;

    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const DeleteButton = styled.button`
  position: absolute;

  top: 50%;
  right: 0;

  width: 24px;
  height: 24px;
  line-height: 16px;

  margin: 0;
  padding: 5px 6px 7px;

  background: transparent;
  border: none;
  border-radius: 5px;

  cursor: pointer;
  transform: translateY(-50%);

  svg {
    width: 12px;
    height: 12px;

    color: #ffffff;

    opacity: 0.5;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);

    svg {
      opacity: 1;
    }
  }

  &:active {
    background: rgba(255, 255, 255, 0.2);

    svg {
      opacity: 1;
    }
  }
`;

const Hr = styled.hr`
  width: 100%;
  height: 1px;

  margin: -16px 0;

  background-color: ${(props) => props.theme.accent};
  border: none;
`;

const UserInfoStyle = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserPhoto = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const UserName = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;

  font-size: 16px;
  color: #ffffff;
`;

const SettingsButton = styled.button`
  padding: 10px 8px 6px;
  margin: 0;

  background-color: transparent;
  border: none;
  border-radius: 5px;
  color: #ffffff;

  cursor: pointer;
  opacity: 0.75;
  transition: all 0.3s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    opacity: 1;
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SettingsMenu = styled.div<{ open?: boolean }>`
  position: absolute;

  bottom: calc(100% + 16px);
  left: 0;
  right: 0;

  display: ${(props) => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 0;

  padding: 6px 0;

  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.7);

  button {
    margin: 0;
    padding: 0;

    background-color: transparent;
    border: none;
    text-align: left;

    cursor: pointer;
  }
`;

const SettingsMenuItem = styled.div`
  padding: 12px 16px;

  color: ${(props) => props.theme.primary};
  font-size: 1.6rem;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => props.theme.accent};
  }
`;
