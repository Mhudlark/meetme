import { generateRoomName, roomNameCharacterLib } from '../util';

describe('Utils', () => {
  describe('generateRoomName', () => {
    it('should generate a room name with only expected characters', () => {
      expect(
        generateRoomName()
          .split('')
          .every((char) => roomNameCharacterLib.includes(char))
      ).toBeTruthy();
    });

    it('should generate a room name of given length', () => {
      expect(generateRoomName(100).length).toEqual(100);
      expect(generateRoomName(8).length).toEqual(8);
      expect(generateRoomName(6).length).toEqual(6);
      expect(generateRoomName(1).length).toEqual(1);
      expect(generateRoomName(0).length).toEqual(0);
    });
  });
});
