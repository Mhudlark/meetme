import { useMemo } from 'react';

import type { FilteredUser } from './overlapPreview';

const baseFilteredUserToggleClassName = `
  w-fit
  py-2 px-4
  rounded-md 
  font-bold
  cursor-pointer
  transition duration-300 ease-in-out
  outline-offset-4
  focus:outline-gray-900
`;

const getFilteredUserToggleClassName = (selected: boolean) => {
  if (selected) {
    return ` 
      ${baseFilteredUserToggleClassName}
      bg-gray-900 hover:bg-gray-400 focus:bg-gray-900
      text-white hover:text-gray-900 focus:text-white
      border-2 
      border-gray-900 hover:border-gray-400
    `;
  }
  return ` 
      ${baseFilteredUserToggleClassName}
      bg-gray-300 hover:bg-gray-700 focus:bg-gray-300
      text-gray-700 hover:text-white focus:text-gray-700
      border-2 
      border-gray-300 hover:border-gray-700 focus:border-gray-300
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
      {filteredUser.username}
    </div>
  );
}
