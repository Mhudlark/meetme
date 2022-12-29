import { chars } from './meetingCode';

export const validateUsername = (username: string) => {
  // TODO: username validity function
  return username !== '';
};

export const validateMeetingCode = (meetingCode: string) => {
  return (
    meetingCode.length === 6 &&
    meetingCode.split('').every((char) => chars.includes(char))
  );
};

export const validateMeetingName = (meetingName: string) => {
  // TODO: meeting name validity function
  return meetingName !== '';
};

export const validateMeetingDescription = (meetingDescription: string) => {
  // TODO: meeting description validity function
  return meetingDescription.length < 2000;
};
