import { AddCircle, CheckCircle } from '@mui/icons-material';
import { useMemo } from 'react';

import type { FilteredUser } from './overlapPreview';

const baseFilteredUserToggleClassName = `
  flex items-center gap-1.5
  w-fit
  py-1 pl-2 pr-2.5
  rounded-full 
  font-bold
  select-none
  cursor-pointer
  transition duration-300 ease-in-out
  outline-offset-4
  focus:outline-gray-900
`;

const getFilteredUserToggleClassName = (selected: boolean) => {
  if (selected) {
    return ` 
      ${baseFilteredUserToggleClassName}
      bg-gray-900 hover:bg-transparent
      text-white hover:text-gray-900
      border-2 
      border-gray-900
    `;
  }
  return ` 
      ${baseFilteredUserToggleClassName}
      bg-transparent hover:bg-gray-900
      text-gray-900 hover:text-white
      border-2 
      border-gray-900
    `;
};

export interface FilteredUserProps {
  filteredUser: FilteredUser;
  toggleFilteredUser: (filteredUser: FilteredUser) => void;
}

export default function FilteredUserToggle({
  filteredUser,
  toggleFilteredUser,
}: FilteredUserProps) {
  const className = useMemo(
    () => getFilteredUserToggleClassName(filteredUser.included),
    [filteredUser.included]
  );

  return (
    <div
      key={filteredUser.userId}
      className={className}
      onClick={() => toggleFilteredUser(filteredUser)}
    >
      {filteredUser.included ? <CheckCircle /> : <AddCircle />}
      {filteredUser.username}
    </div>
  );
}
