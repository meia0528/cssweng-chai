import useSidebarHook from './hooks/useSidebarHook.js'
import createProductHook from './hooks/Product-Mgmt/createProductHook.js';
import Sidebar from "./components/Sidebar.jsx";
import DisplayProducts from  './components/Product-Mgmt/DisplayProducts.jsx';
import CreateProduct from './components/Product-Mgmt/CreateProduct.jsx'

const App = () => {

    const createProductHooks = createProductHook();
    const sidebarHooks = useSidebarHook();            

    const renderSubPageContent = (selectedManagement) => {
        switch(selectedManagement){
            case 'Product Management':
                if(sidebarHooks.subPage === 'Display') return <DisplayProducts />
                if(sidebarHooks.subPage === 'Add') return <CreateProduct 
                                                imagePreviews={createProductHooks.imagePreviews}
                                                handleImageChange={createProductHooks.handleImageChange}
                                                handleSubmit={createProductHooks.handleSubmit}
                                                productTypes={createProductHooks.productTypes}
                                                displayDropDownList={createProductHooks.displayDropDownList}
                                                isOpen={createProductHooks.isOpen}
                                                dropdownRef={createProductHooks.dropdownRef}
                                                handleDropdownSelect={createProductHooks.handleDropdownSelect}
                                                selectedType={createProductHooks.selectedType}
                                                setSelectedTitle={createProductHooks.setSelectedTitle}
                                                selectedTitle={createProductHooks.selectedTitle}
                                                selectedDescription={createProductHooks.selectedDescription}
                                                setSelectedDescription={createProductHooks.setSelectedDescription}
                                                selectedPrice={createProductHooks.selectedPrice}
                                                setSelectedtPrice={createProductHooks.setSelectedtPrice}
                                                selectedQty={createProductHooks.selectedQty}
                                                setSelectedQty={createProductHooks.setSelectedQty}
                                                alert={createProductHooks.alert} />

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
                management={sidebarHooks.management}
                isOpen={sidebarHooks.isOpen}
                subPage={sidebarHooks.subPage} 
                dropdownRef={sidebarHooks.dropdownRef}
                displayDropDownList={sidebarHooks.displayDropDownList}
                renderSubPage={sidebarHooks.renderSubPage}
                handleDropdownSelect={sidebarHooks.handleDropdownSelect}/>

            {renderSubPageContent(sidebarHooks.management)}
        </>
    );
}

export default App;