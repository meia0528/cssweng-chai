import '../../../assets/css/Product-Mgmt/displayProducts/product-filtering.css'
import displayProductsHook from '../../../hooks/Product-Mgmt/displayProductsHook.js';

const Filtering = () => {
    const sortOptionList = ['Alphabetical', 'Price: High to Low', 'Price: Low to High'];
    const {sortOption, displayDropDownList, handleDropDownSelect, isOpen, dropdownRef, 
            productTypes, handleSelectedProductFilter} = displayProductsHook();

    return (
        <nav>
            <div className="filter-section">
                <div className="sort-section">
                    <p>Sort By</p>
                    <div className="dropdown-section" ref={dropdownRef}>
                        <button 
                            className="dropdown-button"
                            onClick={displayDropDownList}>
                            
                            {sortOption}
                        </button>
                        
                        {isOpen && (
                            <div className="dropdown-list">
                                {sortOptionList.map((option, index) => (
                                    <div 
                                        className="dropdown-item"
                                        key={index}
                                        onClick={(e) => handleDropDownSelect(option)}>

                                        {option}
                                    </div>
                                ))}
                            </div>                            
                        )}

                    </div>
                </div>


                <div className="product-section">
                    <p>Products</p>
                    
                    {productTypes.map((type, index) => (
                        <label className="checkbox-section">
                            <input 
                                type="checkbox" 
                                onChange={(e) => handleSelectedProductFilter(e, type.name)}
                            />
                            <span className="checkmark"></span>
                            
                            {type.name}
                        </label>
                    ))}               
                </div>
            </div>                
        </nav>
    );

};

export default Filtering;