import '../../assets/css/Product-Mgmt/upload.css'
import createProductHook from '../../hooks/Product-Mgmt/createProductHook.js';

const CreateProduct = () => {
    const {
        imagePreviews, handleImageChange, handleSubmit, productTypes, displayDropDownList,
        isOpen, dropdownRef, handleDropdownSelect, selectedType, setSelectedTitle, 
        selectedTitle, selectedDescription, setSelectedDescription, selectedPrice, 
        seSelectedtPrice, selectedQty, setSelectedQty} = createProductHook();
    
    return (
        <main> 
            <div className="product-upload-section">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <button className="btnSubmit" type="submit"> <img src="img/Product-Mgmt/create-product/save.png" /> Save</button>

                    
                    <label className="label">Upload Image</label>
                    <div className="upload-container">    
                        {imagePreviews.map((preview, index) => (

                            <label className="upload-box">
                                <input name='images' type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} />

                                {preview ? (
                                    <img className="preview" src={preview} />
                                ) : (
                                    <img className="upload-icon" src="img/Product-Mgmt/create-product/upload.png" />
                                )}

                            </label>
                        ))}
                    </div>

                    
                    <label className="label">Product Name</label>
                    <input 
                        type="text" 
                        className="product-input-text"
                        value={selectedTitle}
                        onChange={(e) => setSelectedTitle(e.target.value)} />

                    <label className="label">Product Description</label>
                    <textarea 
                        className="input-textarea"
                        value={selectedDescription}
                        onChange={(e) => setSelectedDescription(e.target.value)}></textarea>

                    <label className="label">Product Type</label>
                    <div className="dropdown-section" ref={dropdownRef}>
                        <button 
                            type="button" 
                            className="dropdown-button"
                            onClick={displayDropDownList}>
                            {selectedType}
                        </button>
                        
                        {isOpen && (
                            <div className="dropdown-list">
                                {productTypes.map((type, index) => (
                                    <div 
                                        key={index} 
                                        className="dropdown-item"
                                        onClick={(e) => handleDropdownSelect(type.name)}>
                                            
                                        {type.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                    </div>


                    <label className="label">Php Price</label>
                    <input 
                        type="text" 
                        className="input-text"
                        value={selectedPrice}
                        onChange={(e) => seSelectedtPrice(e.target.value)} />

                    <label className="label">Quantity</label>
                    <input 
                        type="text" 
                        className="input-text" 
                        value={selectedQty}
                        onChange={(e) => setSelectedQty(e.target.value)}/>

                </form>
            </div>
        </main>
    )
};


export default CreateProduct;