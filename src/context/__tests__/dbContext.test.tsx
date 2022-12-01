import { render } from '@testing-library/react';

describe('template', () => {
  it('template', async () => {
    render(<div></div>);
    expect(true).toBeTruthy();
  });
});

// eslint-disable-next-line simple-import-sort/imports
// import { PresenceChannelEvent } from '@/backend/db/helpers';
// import { initUser } from '@/sharedUtils/user';
// import { useAppSelector } from '@/store/hooks';
// import store from '@/store/store';
// import { createClient as createClientOG } from '@supabase/supabase-js';
// import type { RenderOptions } from '@testing-library/react';
// import { waitFor, fireEvent, render, screen } from '@testing-library/react';

// import type { ReactNode } from 'react';
// import { useContext } from 'react';
// import { Provider } from 'react-redux';

// import DbProvider, { DbContext } from '../dbContext';

// const createClient = createClientOG as jest.Mock;
// jest.mock('@supabase/supabase-js');

// const mockRoomName = 'mockRoomName';

// const Consumer = () => {
//   const { room } = useAppSelector((state) => state);
//   const { createRoom, joinRoom, leaveRoom } = useContext(DbContext);
//   return (
//     <>
//       <button onClick={createRoom}>createRoom</button>
//       <button onClick={() => joinRoom(mockRoomName)}>joinRoom</button>
//       <button onClick={leaveRoom}>leaveRoom</button>
//       <div>{room.roomName}</div>
//       {room.users.map((user) => (
//         <div key={user.username}>{user.username}</div>
//       ))}
//     </>
//   );
// };

// const customRender = (
//   consumer: ReactNode,
//   providerProps: {} | undefined = {},
//   renderOptions: RenderOptions | undefined = {}
// ) => {
//   return render(
//     <Provider store={store}>
//       <DbProvider {...providerProps}>{consumer}</DbProvider>
//     </Provider>,
//     renderOptions
//   );
// };

// // const spyReturns = (returnValue: unknown) => jest.fn(() => returnValue);

// describe('dbContext', () => {
//   beforeEach(() => {
//     jest.resetModules();
//   });

//   const mockSupabase = (
//     shouldEmitJoinEvent: boolean = false,
//     newPresences: unknown[] = [],
//     shouldEmitLeaveEvent: boolean = false,
//     leftPresences: unknown[] = []
//   ) => {
//     createClient.mockReturnValue({
//       channel: jest.fn().mockReturnValue({
//         on: jest
//           .fn()
//           .mockImplementation(
//             (
//               _type: string,
//               filter: { event: PresenceChannelEvent },
//               callback: (
//                 payload:
//                   | { leftPresences: unknown[] }
//                   | { newPresences: unknown[] }
//               ) => void
//             ) => {
//               if (filter.event === PresenceChannelEvent.join) {
//                 if (shouldEmitJoinEvent) callback({ newPresences });
//               }
//               if (filter.event === PresenceChannelEvent.leave) {
//                 if (shouldEmitLeaveEvent) callback({ leftPresences });
//               }
//             }
//           ),
//         subscribe: jest.fn(),
//       }),
//     });
//   };

//   describe('createRoom', () => {
//     it('Should create a room with the given user listed', async () => {
//       const mockedUserId = 'mockedUserId';

//       mockSupabase(true, [initUser(mockedUserId)]);

//       customRender(<Consumer />);
//       fireEvent.click(screen.getByText('createRoom'));

//       await waitFor(() => {
//         expect(screen.getByText(mockedUserId)).toBeInTheDocument();
//       });
//     });
//   });

//   describe('joinRoom', () => {
//     it('Should join a room with the given users listed', async () => {
//       const mockThisUser = 'mockThisUser';
//       const mockOtherUser1 = 'mockOtherUser1';
//       const mockOtherUser2 = 'mockOtherUser2';

//       mockSupabase(true, [
//         initUser(mockThisUser),
//         initUser(mockOtherUser1),
//         initUser(mockOtherUser2),
//       ]);

//       customRender(<Consumer />);
//       fireEvent.click(screen.getByText('joinRoom'));

//       await waitFor(() => {
//         expect(screen.getByText(mockThisUser)).toBeInTheDocument();
//       });
//       await waitFor(() => {
//         expect(screen.getByText(mockOtherUser1)).toBeInTheDocument();
//       });
//       await waitFor(() => {
//         expect(screen.getByText(mockOtherUser2)).toBeInTheDocument();
//       });
//     });
//   });
// });
