import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchProducts from "../../../hooks/Product-Mgmt/useFetchProducts.js";

const Content = ({setSearch, search, sortOption, productFilter, showModal, setShowModal, clearAllProducts, alert}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const { products, totalPages } = useFetchProducts(currentPage, search, sortOption, productFilter);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    
    return (
        <main className="displayAllProducts">

            {alert.message && (
                <div className={`alert-section alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}

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
                    <div className="clear-section">
                        <button 
                            className="clear-all-btn"
                            onClick={() => setShowModal(true)}>
                            Clear All
                        </button>

                        {showModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <p>Are you sure you want to delete all products?</p>

                                    <div className='modal-content-btnSection'>
                                        <button onClick={() => {clearAllProducts(), setShowModal(false)}}>Yes, Delete</button>
                                        <button onClick={() => setShowModal(false)}>No, Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div>
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

                    <div>
                        <p className="page-summary">
                            {totalPages > 0 ? (currentPage) : ('0')} / {totalPages} {totalPages > 1 ? ('pages') : ('page')}
                        </p>
                    </div>

                </div>
    
            </div>
        
        </main>
    );
}

export default Content;