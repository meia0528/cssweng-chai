import '../../assets/css/Membership-Mgmt/members.css';
import displayMembersHook from '../../hooks/Membership-Mgmt/displayMembersHook.js';
import Filtering from './display-members-subComponents/Filtering.jsx';
import Content from './display-members-subComponents/Content.jsx';

const DisplayMembers = () => {
  const hook = displayMembersHook();

  return (
    <main className="display-body">
      <Filtering
        sortOption={hook.sortOption}
        displayDropDownList={hook.displayDropDownList}
        handleDropDownSelect={hook.handleDropDownSelect}
        isOpen={hook.isOpen}
        dropdownRef={hook.dropdownRef}
        statusFilters={hook.statusFilters}
        handleSelectedStatusFilter={hook.handleSelectedStatusFilter}
      />
      <Content
        setSearch={hook.setSearch}
        search={hook.search}
        sortOption={hook.sortOption}
        statusFilters={hook.statusFilters}
      />
    </main>
  );
};

export default DisplayMembers;
