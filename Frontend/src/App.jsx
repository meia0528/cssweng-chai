import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import useSidebarHook from './hooks/useSidebarHook.js'
import Sidebar from "./components/Sidebar.jsx";
import DisplayProducts from  './components/Product-Mgmt/DisplayProducts.jsx';
import CreateProduct from './components/Product-Mgmt/CreateProduct.jsx'
import DisplaySingleProduct from "./components/Product-Mgmt/DisplaySingleProduct.jsx";
import UpdateProduct from "./components/Product-Mgmt/UpdateProduct.jsx";
import Login from "./components/Login-Register/Login.jsx";
import Register from "./components/Login-Register/Register.jsx";


const Layout = ({ children }) => {
    const sidebarHooks = useSidebarHook();
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
    
    return (
        <Router>
            
            <Routes>

                {/* default route */}
                <Route 
                    path="/" 
                    element={<Navigate to="/admin/login" replace />} />           


                {/* login page */}
                <Route
                    path="/admin/login"
                    element={<Login/>}/>


                {/* register page */}
                <Route
                    path="/admin/register"
                    element={<Register/>}/>


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
                            <CreateProduct />
                        </Layout>
                    }/>
                    

                {/* product display page */}
                <Route 
                    path="/admin/product-mgmt/display/:id"
                    element={<DisplaySingleProduct />}/>

                
                {/* product update page */}
                <Route 
                    path="/admin/product-mgmt/update/:id"
                    element={<UpdateProduct />}/>

            </Routes>
        </Router>
    );
}

export default App;