import '../assets/css/sidebar.css'

const Sidebar = ({management, isOpen, subPage, dropdownRef, displayDropDownList, renderSubPage, handleDropdownSelect}) => {
    const mgmtOptions = ['Product Management', 'Post Management', 'Sales Management', 'Membership Management'];
    const subPageOptions = ['Display', 'Add'];

    return (
        <nav>
            <div className="sidebar">
                <div className="sidebar-upper-section">
                    <img className="sidebar-chai-logo" src='img/sidebar/logo.png' />

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
                                        onClick={() => handleDropdownSelect(option)}>
                                        
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
                                onClick={() => renderSubPage(option)}>

                                <img className={`${(option.charAt(0).toLowerCase() + option.slice(1))}-image`} src={`img/sidebar/${(option.charAt(0).toLowerCase() + option.slice(1))}.png`}/>

                                {option}
                            </button>
                        ))}

                    </div>

                </div>

                <div className="sidebar-lower-section">
                    <button className="logout-button">
                        LOGOUT
                        <img className="logout-image" src="img/sidebar/logout.png" />
                    </button>
                </div>
            </div>
        </nav>            
    );
};

export default Sidebar;