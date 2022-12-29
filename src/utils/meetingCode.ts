import { random } from 'lodash';

export const chars = 'abcdefghjkmnpqrstuvwxy0123456789';

export const generateMeetingCode = (): string => {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    const index = random(0, chars.length - 1);
    code += chars[index];
  }
  return code;
};

export const generateUniqueMeetingCode = (existingCodes: string[]): string => {
  let meetingCode = '';
  do {
    meetingCode = generateMeetingCode();
  } while (existingCodes.includes(meetingCode));

  return meetingCode;
};
