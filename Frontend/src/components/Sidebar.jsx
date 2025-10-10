import '../assets/css/sidebar.css'
import { useNavigate } from "react-router-dom";

const Sidebar = ({mgmtPath, management, isOpen, subPage, dropdownRef, displayDropDownList, renderSubPage, handleDropdownSelect}) => {
    const navigate = useNavigate();
    const mgmtOptions = ['Product Management', 'Post Management', 'Sales Management', 'Membership Management'];
    const subPageOptions = ['Display', 'Add'];


    return (
        <nav>
            <div className="sidebar">
                <div className="sidebar-upper-section">
                    <img className="sidebar-chai-logo" src='/img/sidebar/logo.png' />

                    <div className="sidebar-dropdown-section" ref={dropdownRef}>
                        <button 
                            className="sidebar-dropdown-button" 
                            onClick={displayDropDownList}>
                                
                            {management}
                        </button>

                        {isOpen && (
                            <div className="sidebar-dropdown-list">
                                {mgmtOptions.map((option, i) => (
                                    <div 
                                        key={i} 
                                        className="sidebar-dropdown-item" 
                                        onClick={() => {handleDropdownSelect(option)

                                            if (option === mgmtOptions[0]) navigate('/admin/product-mgmt/display');  
                                            if (option === mgmtOptions[1]) navigate('/admin/post-mgmt/display');
                                            if (option === mgmtOptions[2]) navigate('/admin/sales-mgmt/display');
                                            if (option === mgmtOptions[3]) navigate('/admin/membership-mgmt/display');

                                        }}>
                                        
                                        {option}
                                    </div>
                                ))}
                            </div>                        
                        )}

                    </div>
                
                    <div className="sidebar-option-section">

                        {subPageOptions.map((option, index) => (
                            <button 
                                key={index}
                                className={`sidebar-option-button ${subPage === option ? 'active' : ''}`}
                                onClick={() => { renderSubPage(option);
                                    
                                    if(option === subPageOptions[0]) navigate(`/admin/${mgmtPath}/display`);
                                    if(option === subPageOptions[1]) navigate(`/admin/${mgmtPath}/create`);

                                }}>

                                <img className={`${(option.charAt(0).toLowerCase() + option.slice(1))}-image`} src={`/img/sidebar/${(option.charAt(0).toLowerCase() + option.slice(1))}.png`}/>

                                {option}
                            </button>
                        ))}

                    </div>

                </div>

                <div className="sidebar-lower-section">
                    <button className="logout-button">
                        LOGOUT
                        <img className="logout-image" src="/img/sidebar/logout.png" />
                    </button>
                </div>
            </div>
        </nav>            
    );
};

export default Sidebar;