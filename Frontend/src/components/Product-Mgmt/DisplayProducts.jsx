import '../../assets/css/Product-Mgmt/displayProducts/product-display.css'
import displayProductsHook from '../../hooks/Product-Mgmt/displayProductsHook.js';
import Filtering from './display-products-subComponents/Filtering.jsx';
import Content from './display-products-subComponents/Content.jsx';

const DisplayProducts = () => {
    const hook = displayProductsHook();

    return (
        <main className='display-body'>
            <Filtering
                sortOption={hook.sortOption}
                displayDropDownList={hook.displayDropDownList}
                handleDropDownSelect={hook.handleDropDownSelect}
                isOpen={hook.isOpen}
                dropdownRef={hook.dropdownRef}
                productTypes={hook.productTypes}
                handleSelectedProductFilter={hook.handleSelectedProductFilter}
            />
            <Content
                setSearch={hook.setSearch}
                search={hook.search}
                productFilter={hook.productFilter}
                sortOption={hook.sortOption}
            />
        </main>
    );
}

export default DisplayProducts;
