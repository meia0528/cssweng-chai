import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { isExpired } from "react-jwt";
import useSidebarHook from './hooks/useSidebarHook.js'
import useAuthCheck from "./hooks/useAuthCheck.js";
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
                    handleLogout={sidebarHooks.handleLogout}
                />
            )}
            
            {children}
        </>
    );
};


const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("adminToken");

    if (!token) return <Navigate to="/admin/login" replace />;

    if (isExpired(token)) {
        localStorage.removeItem("adminToken");
        return <Navigate to="/admin/login" replace />;
    }

    // otherwise, render the page
    return children;
};


const AppRoutes = () => {
    useAuthCheck();

    return (   
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
                    <ProtectedRoute>
                        <Layout>
                            <DisplayProducts />
                        </Layout>                            
                    </ProtectedRoute>
                } />


            {/* product create page */}
            <Route 
                path="/admin/product-mgmt/create"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <CreateProduct />
                        </Layout>                        
                    </ProtectedRoute>
                }/>
                

            {/* product display page */}
            <Route 
                path="/admin/product-mgmt/display/:id"
                element={
                    <ProtectedRoute>
                        <DisplaySingleProduct />
                    </ProtectedRoute>
                }/>

            
            {/* product update page */}
            <Route 
                path="/admin/product-mgmt/update/:id"
                element={
                    <ProtectedRoute>
                        <UpdateProduct />
                    </ProtectedRoute>
                }/>

        </Routes>
    );
}

const App = () => (
    <Router>
        <AppRoutes />
    </Router>
);

export default App;