import '../../assets/css/Product-Mgmt/createProduct/upload.css'
import createProductHook from '../../hooks/Product-Mgmt/createProductHook.js';

const CreateProduct = () => {
                            
    const hook = createProductHook();

    return (
        <main className='create-product-body'> 
            <div className="product-upload-section">
                <div className='createProduct'>
                    {hook.alert.message && (
                        <div className={`alert-section alert-${hook.alert.type}`}>
                            {hook.alert.message}
                        </div>
                    )}                    
                </div>

                <form onSubmit={hook.handleSubmit} encType="multipart/form-data">
                    <button className="btnSubmit" type="submit"> <img src="/img/Product-Mgmt/create-product/save.png" /> Save</button>

                    
                    <label className="label">Upload Image</label>
                    <div className="upload-container">    
                        {hook.imagePreviews.map((preview, index) => (

                            <label className="upload-box" key={index}>
                                <input  
                                    key={index}
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => hook.handleImageChange(e, index)} 
                                />

                                {preview ? (
                                    <img className="preview" src={preview} />
                                ) : (
                                    <img className="upload-icon" src="/img/Product-Mgmt/create-product/upload.png" />
                                )}

                                <button 
                                    key={index}
                                    type='button'
                                    className='removepicBtn'
                                    onClick={() => hook.handleRemoveFile(index)}>
                                    X
                                </button>

                            </label>
                        ))}
                    </div>

                    
                    <label className="label">Product Name</label>
                    <input 
                        type="text" 
                        required
                        className="product-input-text"
                        value={hook.selectedTitle}
                        onChange={(e) => hook.setSelectedTitle(e.target.value)} />

                    <label className="label">Product Description</label>
                    <textarea 
                        className="input-textarea"
                        required
                        value={hook.selectedDescription}
                        onChange={(e) => hook.setSelectedDescription(e.target.value)}></textarea>

                    <label className="label">Product Type</label>
                    <div className="dropdown-section" ref={hook.dropdownRef}>
                        <button 
                            type="button" 
                            className="dropdown-button"
                            onClick={hook.displayDropDownList}>
                            {hook.selectedType}
                        </button>
                        
                        {hook.isOpen && (
                            <div className="dropdown-list">
                                {hook.productTypes.map((type, index) => (
                                    <div 
                                        key={index} 
                                        className="dropdown-item"
                                        onClick={(e) => hook.handleDropdownSelect(type.name)}>
                                            
                                        {type.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                    </div>


                    <label className="label">Php Price</label>
                    <input 
                        type="text" 
                        required
                        className="input-text"
                        value={hook.selectedPrice}
                        onChange={(e) => hook.setSelectedtPrice(e.target.value)} />

                    <label className="label">Quantity</label>
                    <input 
                        type="text" 
                        required
                        className="input-text" 
                        value={hook.selectedQty}
                        onChange={(e) => hook.setSelectedQty(e.target.value)}/>

                </form>
            </div>
        </main>
    )
};


export default CreateProduct;