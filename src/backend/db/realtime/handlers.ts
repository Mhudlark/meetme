export {};
// /**
//  * Called whenever a user (including this user) joins the current room.
//  * @param payload
//  */
// const onJoin: OnJoinCallback = (payload: ClientData[]) => {
//   const newUsers = payload.map((clientPayload) => {
//     return initUser(clientPayload.user.username);
//   });

//   dispatch(addUsersToRoom(newUsers));
// };

// const onSync = (roomName: string, payload: RealtimePresenceState) => {
//   console.log('on sync');
//   console.log('roomName:', roomName);
//   console.log(payload);
// };

// /**
//  * Called whenever a user leaves the current room
//  * @param payload
//  */
// const onLeave = (payload: CustomPresence[]) => {
//   const leftUsersUsernames = payload.map(
//     (presence) => presence.user.username
//   );

//   dispatch(removeUsersFromRoom(leftUsersUsernames));
// };
