import { SET_USERNAME } from '../actions';
import { userReducerInitialState } from '../helpers';
import userReducer from '../reducer';

describe('User reducer', () => {
  it('should handle set username', () => {
    const username = 'testId';
    expect(
      userReducer(userReducerInitialState, {
        type: SET_USERNAME,
        payload: username,
      })
    ).toEqual({
      ...userReducerInitialState,
      username,
    });
  });
});
