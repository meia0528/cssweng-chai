import '../../assets/css/Sales-Mgmt/sales.css'
import displaySalesHook from '../../hooks/Sales-Mgmt/displaySalesHook.js';
import Filtering from './display-sales-subComponents/Filtering.jsx';
import Content from './display-sales-subComponents/Content.jsx';

const DisplaySales = () => {
  const hook = displaySalesHook();

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

export default DisplaySales;
