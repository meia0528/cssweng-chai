import { useNavigate } from 'react-router-dom';
import '../../assets/css/Product-Mgmt/updateProduct/header.css'
import '../../assets/css/Product-Mgmt/updateProduct/content.css'
import updateProductHook from '../../hooks/Product-Mgmt/updateProductHook.js';

const UpdateProduct = () => {
    const navigate = useNavigate();
    const hook = updateProductHook();
    
    return (
        <main className='updateProduct'>
            <form onSubmit={hook.handleUpdate} encType="multipart/form-data">
                <nav>
                    <div className="header-section">
                        <img className="chai-logo" src="/img/Product-Mgmt/update-product/logo.png" />

                        <div className="option-section">
                            
                            <button type="button" onClick={() => navigate(-1)}> 
                                    <img src="/img/Product-Mgmt/update-product/return.png" /> 
                                    Return 
                            </button>

                            <button type="submit"> 
                                <img src="/img/Product-Mgmt/update-product/save.png" /> 
                                Save
                            </button>

                        </div>
                    </div>
                </nav>

                <main>
                    <div className="product-overview-grid">
                        <div className="product-image-section">
                            <img className="main-display-img" src={`http://localhost:5000/${hook.lSizePhoto}`} />

                            <div className="upload-container">    

                                {Array.from({length: 4}).map((_, index) => (
                                    <label key={index} className="upload-box">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => hook.handleImageChange(e, index)}
                                        />

                                        {hook.imagePreviews[index] ? (
                                            <img className="preview" src={`${hook.imagePreviews[index]}`} />
                                        ) : (

                                            hook.prevImageFiles[index] ? (
                                                <img className="preview" src={`http://localhost:5000/${hook.prevImageFiles[index]}`} />
                                            ) : (
                                                <img className="upload-icon" src="/img/Product-Mgmt/update-product/upload.png" />
                                            )

                                        )}

                                    </label>                                    
                                ))}

                            </div>
                        </div>

                        <div className="product-details">
                            <label className="label">Product Name</label>
                            <input
                                required
                                className="product-title-input"
                                type="text"
                                value={hook.selectedTitle || ''}
                                onChange={(e) => hook.setSelectedTitle(e.target.value)} 
                            />


                            <div className="product-stats-section">
                                <label className="stats-input">
                                    Php: <input 
                                            required
                                            type="text" 
                                            value={hook.selectedPrice || ''} 
                                            onChange={(e) => hook.setSelectedtPrice(e.target.value)}
                                        />
                                </label>

                                <label className="stats-input">
                                    Qty: <input type="text" value={hook.product?.quantity} />
                                </label>
                            </div>

                            
                            <label className="label">Product Description</label>
                            <textarea 
                                className="product-description" 
                                value={hook.selectedDescription || ''}
                                onChange={(e) => hook.setSelectedDescription(e.target.value)}>
                            </textarea>


                            <div className="dropdown-section" ref={hook.dropdownRef}>
                                <button 
                                    type="button" 
                                    className="dropdown-button"
                                    onClick={() => hook.setIsOpen(!hook.isOpen)}>
                                    
                                    {hook.selectedType}
                                </button>

                                {hook.isOpen && (
                                    <div className="dropdown-list">
                                        {hook.productTypes.map((type, index) => (
                                            <div 
                                                key={index} 
                                                className="dropdown-item"
                                                onClick={() => hook.handleDropdownSelect(type.name)}>
                                                
                                                {type.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>

            </form>
        </main>        
    );
};

export default UpdateProduct;