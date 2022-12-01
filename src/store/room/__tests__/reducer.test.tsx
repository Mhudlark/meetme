/* eslint-disable jest/no-mocks-import */

import { mockRoom } from '@/../__mocks__/room';
import { initUser } from '@/sharedUtils/user';

import {
  ADD_USER_TO_ROOM,
  ADD_USERS_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
  RESET_ROOM,
  SET_ROOM,
  SET_ROOM_NAME,
} from '../actions';
import { roomReducerInitialState } from '../helpers';
import roomReducer from '../reducer';

describe('Room reducer', () => {
  it('reset room', () => {
    expect(
      roomReducer(mockRoom, {
        type: RESET_ROOM,
        payload: null,
      })
    ).toEqual(roomReducerInitialState);
  });

  it('set room', () => {
    expect(
      roomReducer(roomReducerInitialState, {
        type: SET_ROOM,
        payload: mockRoom,
      })
    ).toEqual(mockRoom);
  });

  it('set room name', () => {
    const newRoomName = 'new-room-name';
    expect(
      roomReducer(mockRoom, {
        type: SET_ROOM_NAME,
        payload: newRoomName,
      }).roomName
    ).toEqual(newRoomName);
  });

  it('add user to room', () => {
    const mockRoomNumUsers = mockRoom.users.length;
    const newUser = initUser('abc000', 'new-user');

    const newReducer = roomReducer(mockRoom, {
      type: ADD_USER_TO_ROOM,
      payload: newUser,
    });

    // Check that the number of users in the room is correct
    expect(newReducer.users.length).toEqual(mockRoomNumUsers + 1);

    // Check that the new user is in the room
    expect(newReducer.users[newReducer.users.length - 1]?.username).toEqual(
      newUser.username
    );
  });

  it('add users to room', () => {
    const mockRoomNumUsers = mockRoom.users.length;
    const newUsers = [
      initUser('abc001', 'new-user-1'),
      initUser('abc002', 'new-user-2'),
    ];

    const newReducer = roomReducer(mockRoom, {
      type: ADD_USERS_TO_ROOM,
      payload: newUsers,
    });

    // Check that the number of users in the room is correct
    expect(newReducer.users.length).toEqual(mockRoomNumUsers + newUsers.length);

    // Check that the new users are in the room
    newUsers.forEach((newUser) => {
      const filteredReducerUsers = newReducer.users.filter((user) => {
        return user.username === newUser.username;
      });
      expect(filteredReducerUsers.length).toEqual(1);
    });
  });

  it('remove user from room', () => {
    const mockRoomNumUsers = mockRoom.users.length;
    const userToBeRemoved = mockRoom.users[0]?.userId ?? '';

    const newReducer = roomReducer(mockRoom, {
      type: REMOVE_USER_FROM_ROOM,
      payload: userToBeRemoved,
    });

    // Check that the number of users in the room is correct
    expect(newReducer.users.length).toEqual(mockRoomNumUsers - 1);

    // Check that the removed user is not in the room
    expect(
      newReducer.users.filter((users) => users.username === userToBeRemoved)
        .length
    ).toEqual(0);
  });
});
