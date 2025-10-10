import '../../assets/css/Product-Mgmt/displayProducts/product-display.css'
import displayProductsHook from '../../hooks/Product-Mgmt/displayProductsHook.js';
import Filtering from './display-products-subComponents/Filtering.jsx';
import Content from './display-products-subComponents/Content.jsx';

const DisplayProducts = () => {
    const {products, setSearch, search} = displayProductsHook();

    return (
        <main>
            <Filtering/>
            <Content 
                products={
                    (search ? (
                        products.filter((product, item) => ((product.title).toLowerCase()).includes(search.toLowerCase()))
                    ) : products)
                }
                setSearch={setSearch}
                search={search}/>

        </main>
    );
}

export default DisplayProducts;