export type GenerateRoomName = (nameLength?: number) => string;

export const roomNameCharacterLib = 'abcdefghjkmnpqrstuvwxyz0123456789';

export const generateRoomName: GenerateRoomName = (nameLength = 6) => {
  const characterLibLength = roomNameCharacterLib.length;
  const numDigitsPerCharacter = 2;

  const time = Date.now() + Math.random();
  const timeStr = time.toString().replace('.', '');
  let fullTimeStr = timeStr;
  while (fullTimeStr.length < nameLength * numDigitsPerCharacter) {
    fullTimeStr += timeStr;
  }

  const randomStringArr = Array(nameLength)
    .fill(0)
    .map((_e, index) => {
      const digitsStartIndex = index * numDigitsPerCharacter;
      const digitsEndIndex = digitsStartIndex + numDigitsPerCharacter;
      const digitsStr = fullTimeStr.slice(digitsStartIndex, digitsEndIndex);

      const digits = parseInt(digitsStr, 10);
      const characterIndex = digits % characterLibLength;

      return roomNameCharacterLib[characterIndex];
    });

  return randomStringArr.join('');
};
