const Login = () => (
    <div>
        <h1 className="title">Login Page</h1>
        <form>
            <div className="login-format">
                <label for="username">Username:</label><br/>
                <input type="text" id="username" name="username"></input><br/>
                <label for="password">Password:</label><br/>
                <input type="password" id="password" name="password"></input><br/><br/>
                <button className="signInButton" type="button">Login</button>
            </div>
        </form>
    </div>

);



export default Login;