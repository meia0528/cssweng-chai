import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchProducts from "../../../hooks/Product-Mgmt/useFetchProducts.js";

const Content = ({setSearch, search, sortOption, productFilter}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const { products, totalPages } = useFetchProducts(currentPage, search, sortOption, productFilter);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    
    return (
        <main>
            <div className="product-main-area">
                
                <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
                    <div className="search-bar-section">
                        <input 
                            className="search-bar" 
                            type="text" 
                            name="search-bar" 
                            id="search-bar" 
                            placeholder="Search here..."
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}/>
                    </div>                              
                </form>          

                <div className="product-display-grid">
                    {products.map((product, index) => (
                        <div className="product-overview" key={index}>
                            <div className="image-section">

                                <Link to={`/admin/product-mgmt/display/${product._id}`} className="product-link">
                                    <img className="product-image" src={`http://localhost:5000/${product.images[0]}`} />
                                </Link>

                                <p className="product-type">{product.type.name}</p>
                            </div>


                            <div className="product-title-section">

                                <Link to={`/admin/product-mgmt/display/${product._id}`} className="product-link">
                                    <p className="product-name">{product.title}</p>
                                </Link>                                
                                
                                <p className="product-price">&#8369; {Number(product.price).toFixed(2)}</p>
                            </div>

                            <p className="product-description">{product.description}</p>

                        </div>
                    ))}
                </div>

                <div className="navigation-area">
                    <button 
                        className="nav-button"
                        onClick={() => goToPage(currentPage - 1)}>
                        
                        &lt;
                    </button>

                    <button
                        className={`round-button`}>
                        {currentPage}
                    </button>

                    <button 
                        className="nav-button"
                        onClick={() => goToPage(currentPage + 1)}>
                        &gt;
                    </button>

                </div>
      
            </div>
            
        </main>
    );
}

export default Content;