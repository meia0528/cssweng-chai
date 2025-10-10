const Content = ({products, setSearch, search}) => {
    return (
        <main>
            <div className="product-main-area">
                
                <form classNameName="searchForm" onSubmit={(e) => e.preventDefault()}>
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
                        <div className="product-overview">
                            <div className="image-section">
                                <img className="product-image" src={`http://localhost:5000/${product.images[0]}`} />
                                <p className="product-type">{product.type.name}</p>
                            </div>

                            <div className="product-title-section">
                                <p className="product-name">{product.title}</p>
                                <p className="product-price">&#8369; {product.price}</p>
                            </div>

                            <p className="product-description">{product.description}</p>

                        </div>
                    ))}
                </div>

                <div className="navigation-area">
                    <button className="nav-button">Previous</button>
                    <button className="round-button active">1</button>
                    <button className="round-button">2</button>
                    <button className="round-button">3</button>
                    <button className="nav-button">Next</button>
                </div>
            </div>
        
            
        </main>
    );
}

export default Content;