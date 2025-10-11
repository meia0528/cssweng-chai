import '../../assets/css/Product-Mgmt/displaySingleProduct/header.css'
import '../../assets/css/Product-Mgmt/displaySingleProduct/content.css'
import displaySingleProductHook from '../../hooks/Product-Mgmt/displaySingleProductHook.js';

const DisplaySingleProduct = () => {

    const {product, lSizePhoto, handleLargeDisplayPhoto} = displaySingleProductHook();

    return (
        <>
            <nav>
                <div className="header-section">
                    <img className="chai-logo" src="/img/Product-Mgmt/product-overview/logo.png" />

                    <div className="option-section">
                        <button> <img src="/img/Product-Mgmt/product-overview/return.png" /> Return</button>
                        <button> <img src="/img/Product-Mgmt/product-overview/update.png" /> Update</button>
                        <button> <img src="/img/Product-Mgmt/product-overview/delete.png" /> Delete</button>
                    </div>
                </div>
            </nav>

            <main>
                <div className="product-overview-grid">
                    <div className="product-image-section">
                        <img className="main-display-img" src={`http://localhost:5000/${lSizePhoto}`} />

                        <div className="product-images-section">
                            {product.images?.map((image, index) => (
                                <img
                                    key={index} 
                                    src={`http://localhost:5000/${image}`} 
                                    onClick={(e) => handleLargeDisplayPhoto(image)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="product-details">
                        <div className="product-title-section">
                            {product.title}
                        </div>

                        <div className="product-stats-section">
                            <p>Php {product.price}</p>
                            <p>Qty: {product.quantity}</p>
                        </div>

                        <div className="product-description-section">
                            <p>{product.description}</p>
                        </div>

                        <div className="product-type-section">{product.type?.name}</div>
                    </div>

                </div>
            </main>        
        
        </>
    );
}

export default  DisplaySingleProduct;