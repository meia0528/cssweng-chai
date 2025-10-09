import useSidebarHook from './hooks/useSidebarHook.js'
import Sidebar from "./components/Sidebar.jsx";
import DisplayProducts from  './components/Product-Mgmt/DisplayProducts.jsx';
import CreateProduct from './components/Product-Mgmt/CreateProduct.jsx'

const App = () => {
    const {management, isOpen, subPage, dropdownRef, displayDropDownList, renderSubPage, handleDropdownSelect} = useSidebarHook();

    const renderSubPageContent = (selectedManagement) => {
        switch(selectedManagement){
            case 'Product Management':
                if(subPage === 'Display') return <DisplayProducts />
                if(subPage === 'Add') return <CreateProduct />

            case 'Membership Management':
                return;

            case 'Sales Management':
                return;

            case 'Post Management':
                return;

            default:
                return null;
        }
    }
    
    return (
        <>
            <Sidebar 
                management={management}
                isOpen={isOpen}
                subPage={subPage} 
                dropdownRef={dropdownRef}
                displayDropDownList={displayDropDownList}
                renderSubPage={renderSubPage}
                handleDropdownSelect={handleDropdownSelect}/>

            {renderSubPageContent(management)}
        </>
    );
}

export default App;