import '../../assets/css/Login-Register/register.css'
import registerHook from "../../hooks/Login-Register/registerHook.js";

const Register = () => {
    const hook = registerHook();

    return (
        <main className="register-page">

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
                            type={hook.showConfirmPassword ? "text" : "password"}
                            name='confirmPassword'
                            placeholder="Confirm Password"
                            value={hook.confirmPassword}
                            onChange={(e) => hook.setConfirmPassword(e.target.value)}/>


                        <button
                            type='button'
                            className='password-toggle'
                            onClick={() => hook.setShowConfirmPassword(!hook.showConfirmPassword)}>
                            
                            <img src={hook.showConfirmPassword ? "/img/Login-Register/visible.png" : "/img/Login-Register/invisible.png"} />
                        </button>                  
                    </div>             

                    <button type="submit" className='submit-btn'>Sign up</button>
                </form>
            </div>

        </main>  
    );
};

export default Register;