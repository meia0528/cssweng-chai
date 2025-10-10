import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import useSidebarHook from './hooks/useSidebarHook.js'
import createProductHook from './hooks/Product-Mgmt/createProductHook.js';
import Sidebar from "./components/Sidebar.jsx";
import DisplayProducts from  './components/Product-Mgmt/DisplayProducts.jsx';
import CreateProduct from './components/Product-Mgmt/CreateProduct.jsx'
import DisplaySingleProduct from "./components/Product-Mgmt/DisplaySingleProduct.jsx";


const Layout = ({ children }) => {
    const sidebarHooks = useSidebarHook();
    const createProductHooks = createProductHook();
    const location = useLocation();

    // only show sidebar on these paths
    const showSidebar = ["/admin/product-mgmt/display", "/admin/product-mgmt/create"].includes(location.pathname);

    return (
        <>
            {showSidebar && (
                <Sidebar
                    mgmtPath={sidebarHooks.mgmtPath}
                    management={sidebarHooks.management}
                    isOpen={sidebarHooks.isOpen}
                    subPage={sidebarHooks.subPage}
                    dropdownRef={sidebarHooks.dropdownRef}
                    displayDropDownList={sidebarHooks.displayDropDownList}
                    renderSubPage={sidebarHooks.renderSubPage}
                    handleDropdownSelect={sidebarHooks.handleDropdownSelect}
                />
            )}
            
            {children}
        </>
    );
};



const App = () => {
    const createProductHooks = createProductHook();
    
    return (
        <Router>

            {/* PRODUCT MANAGEMENT */}
            <Routes>

                {/* default route */}
                <Route 
                    path="/" 
                    element={<Navigate to="/admin/product-mgmt/display" replace />} />                

                {/* product display page */}
                <Route 
                    path="/admin/product-mgmt/display" 
                    element={
                        <Layout>
                            <DisplayProducts />
                        </Layout>
                    } />


                {/* product create page */}
                <Route 
                    path="/admin/product-mgmt/create"
                    element={
                        <Layout>
                            <CreateProduct
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
                        </Layout>
                    }/>

                
                <Route 
                    path="/admin/product-mgmt/display/:id"
                    element={<DisplaySingleProduct />}/>

        

            </Routes>
        </Router>
    );
}

export default App;