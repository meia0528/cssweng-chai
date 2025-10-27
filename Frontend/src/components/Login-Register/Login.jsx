import '../../assets/css/Login-Register/login.css';
import loginHook from '../../hooks/Login-Register/loginHook.js';
import { Link } from 'react-router-dom';

const Login = () => {
    const hook = loginHook();

    return (
        <main className="login-page">

            {hook.alert.message && (
                <div className={`alert-section alert-${hook.alert.type}`}>
                    {hook.alert.message}
                </div>
            )}

            <div className="login-container">
                <form onSubmit={hook.handleLogin} encType="multipart/form-data">
                    <h2>Welcome Back!</h2>

                    <input 
                        required
                        type="text"
                        placeholder="Username"
                        name='username'
                        value={hook.username}
                        onChange={(e) => hook.setUsername(e.target.value)}/>
                    <br/>

                    <input 
                        required
                        type="password"
                        name='password'
                        placeholder="Password"
                        value={hook.password}
                        onChange={(e) => hook.setPassword(e.target.value)}/>
                    <br/>

                    <button type="submit">Login</button>                        

                    <p className="sign-up-msg">
                        Don't have an account?

                        <Link to={'/admin/register'}>
                            <u className="sign-up"> Sign up</u>
                        </Link>
                    </p>
                </form>
            </div>

        </main>      
    );
};

export default Login;