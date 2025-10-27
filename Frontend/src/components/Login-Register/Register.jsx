import '../../assets/css/Login-Register/register.css'
import registerHook from "../../hooks/Login-Register/registerHook.js";

const Register = () => {
    const hook = registerHook();

    return (
        <main className="register-page">
            
            {hook.alert.message && (
                <div className={`alert-section alert-${hook.alert.type}`}>
                    {hook.alert.message}
                </div>
            )}

            <div className="register-container">
                <form onSubmit={hook.handleRegister} encType="multipart/form-data">
                    <h2>Create Account</h2>

                    <input 
                        required
                        type="text"
                        placeholder="Username"
                        name='username'
                        value={hook.username}
                        onChange={(e) => hook.setUsername(e.target.value)}/>
                    <br/>

                    <div className='password-container'>
                        <input 
                            required
                            type={hook.showPassword ? "text" : "password"}
                            name='password'
                            placeholder="Password"
                            value={hook.password}
                            onChange={(e) => hook.setPassword(e.target.value)}/>

                        <button
                            type='button'
                            className='password-toggle'
                            onClick={() => hook.setShowPassword(!hook.showPassword)}>
                            
                            <img src={hook.showPassword ? "/img/Login-Register/visible.png" : "/img/Login-Register/invisible.png"} />
                        </button>

                    </div>

                    <div className='password-container'>
                        <input 
                            required
                            type={hook.showToken ? "text" : "password"}
                            name='token'
                            placeholder="Admin Token"
                            value={hook.token}
                            onChange={(e) => hook.setToken(e.target.value)}/>


                        <button
                            type='button'
                            className='password-toggle'
                            onClick={() => hook.setShowToken(!hook.showToken)}>
                            
                            <img src={hook.showToken ? "/img/Login-Register/visible.png" : "/img/Login-Register/invisible.png"} />
                        </button>                  
                    </div>             

                    <button type="submit" className='submit-btn'>Sign up</button>
                </form>
            </div>

        </main>  
    );
};

export default Register;