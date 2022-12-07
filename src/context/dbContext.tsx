import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

import { deleteMeetingFromDB } from '@/backend/db/database/meeting/delete';
import { selectMeetingFromDB } from '@/backend/db/database/meeting/select';
import { useMessagesListener } from '@/backend/db/database/hooks/useMessagesListener';
import { useRoomListener } from '@/backend/db/database/hooks/useRoomListener';
import { deleteMessagesForRoomFromDB } from '@/backend/db/database/preference/delete';
import { insertPreferenceIntoDB } from '@/backend/db/database/preference/insert';
import type {
  PreferenceSchema,
  UserSchema,
} from '@/backend/db/database/schemas/types';
import { deleteUserFromDB } from '@/backend/db/database/user/delete';
import { insertUserIntoDB } from '@/backend/db/database/user/insert';
import { updateUserRoomIdInDB } from '@/backend/db/database/user/update';
import type { ChatMessage, User } from '@/sharedTypes';
import { initChatMessageFromAuthorId } from '@/sharedUtils/chatMessage';
import { initEvent } from '@/sharedUtils/room';
import { initUser } from '@/sharedUtils/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addUsersToRoom,
  removeUserFromRoom,
  resetRoom,
  setRoom,
} from '@/store/room/actions';
import { setUserId, setUsername } from '@/store/user/actions';

export type DbContextType = {
  login: (username: string) => Promise<void>;
  createRoom: () => Promise<void>;
  joinRoom: (roomName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  chatMessages: ChatMessage[];
};

const DbContextInitialValue: DbContextType = {
  login: (_username) => Promise.resolve(),
  createRoom: () => Promise.resolve(),
  joinRoom: (_roomName) => Promise.resolve(),
  leaveRoom: () => Promise.resolve(),
  sendChatMessage: (_message) => Promise.resolve(),
  chatMessages: [],
};

export const DbContext = createContext<DbContextType>(DbContextInitialValue);

export type DbProviderProps = { children: ReactNode };

const DbProvider = ({ children }: DbProviderProps) => {
  const dispatch = useAppDispatch();

  const supabase = useSupabaseClient();

  const { user, room } = useAppSelector((state) => state);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const onJoin = useCallback((newUsers: User[]) => {
    dispatch(addUsersToRoom(newUsers));
  }, []);

  const onLeave = useCallback((deletedUserId: string) => {
    dispatch(removeUserFromRoom(deletedUserId));
  }, []);

  const unsubscribeAllChannels = () => {
    supabase.removeAllChannels();
  };

  const login = async (username: string) => {
    console.log('login');

    dispatch(setUsername(username));

    const userInfo = await insertUserIntoDB(supabase, username);

    console.log('userInfo', userInfo);

    if (userInfo?.id) dispatch(setUserId(userInfo.id));
  };

  const createRoom = async () => {
    console.log('createRoom');

    const newRoom = createRoom;

    dispatch(
      setRoom({
        roomName: roomInfo.room_id,
        roomId: roomInfo.room_id,
        users: [user],
        chatMessages: [],
      })
    );
  };

  const joinRoom = async (roomName: string) => {
    console.log('joinRoom');

    if (!user.userId) return;

    const userInfo = await updateUserRoomIdInDB(
      supabase,
      user.userId,
      roomName
    );
    console.log('userInfo', userInfo);

    const roomInfo = await selectMeetingFromDB(supabase, userInfo.event_id);
    console.log('roomInfo', roomInfo);

    const roomUsers = roomInfo.users.map((roomUser) =>
      initUser(roomUser.id, roomUser.username)
    );

    const roomJoined = initEvent(roomInfo.id, roomInfo.id, roomUsers);

    dispatch(setRoom(roomJoined));
  };

  const leave = useCallback(async () => {
    console.log('leave');

    if (user.userId) await deleteUserFromDB(supabase, user.userId);

    const isRoomEmpty = room.users.length === 1;

    if (isRoomEmpty) {
      await deleteMessagesForRoomFromDB(supabase, room.roomId);
      // Delete room last - foreign key
      await deleteMeetingFromDB(supabase, room.roomId);
    }

    dispatch(resetRoom());
    unsubscribeAllChannels();
  }, [user, room]);

  const sendChatMessage = async (message: string) => {
    console.log('sendChatMessage');

    const out = await insertPreferenceIntoDB(
      supabase,
      message,
      room.roomId,
      user.userId
    );

    console.log('out', out);
  };

  const handleRoomUsersUpdate = useCallback(
    (newUserInfo: UserSchema) => {
      console.log('handleRoomUsersUpdate');
      console.log('newUserInfo', newUserInfo);

      const newUser: User = {
        userId: newUserInfo.id,
        username: newUserInfo.username,
      };

      onJoin([newUser]);
    },
    [onJoin]
  );

  const handleRoomUsersDelete = useCallback(
    (deletedUserId: string) => {
      console.log('handleRoomUsersDelete');
      console.log('deletedUserId', deletedUserId);
      onLeave(deletedUserId);
    },
    [onLeave]
  );

  const handleMessagesUpdate = useCallback(
    (newMessageInfo: PreferenceSchema) => {
      console.log('handleMessagesUpdate');
      console.log('newMessageInfo', newMessageInfo);

      const newMessage = initChatMessageFromAuthorId(
        newMessageInfo.message_id,
        newMessageInfo.message,
        newMessageInfo.author,
        room.users
      );

      setChatMessages((prevChatMessages) => [...prevChatMessages, newMessage]);
    },
    [room]
  );

  useRoomListener(
    supabase,
    room?.roomName !== undefined,
    room.roomName,
    handleRoomUsersUpdate,
    handleRoomUsersDelete
  );

  useMessagesListener(
    supabase,
    room?.roomName !== undefined,
    room.roomName,
    handleMessagesUpdate
  );

  // THIS CANNOT BE RELIED ON
  // useEffect(() => {
  //   return () => {
  //     leave();
  //   };
  // }, []);

  return (
    <DbContext.Provider
      value={{
        login,
        createRoom,
        joinRoom,
        leaveRoom: leave,
        sendChatMessage,
        chatMessages,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;

export const useDbContext = () => useContext(DbContext);
