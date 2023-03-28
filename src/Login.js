/* OLD LOGIN FORMAT
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
*/
// NEW LOGIN FORMAT
import { DialogAuth } from "react-mui-auth-page";
const Login = () => {
    const SignInResponse = ({ email, password}) => {
        console.log({ email, password });
    };

    const SignUpResponse = ({email, username, password}) => {
        console.log( {email, username, password} )
    };

    const ForgetResponse = ({email}) => {
        console.log({ email });
    };

    const SocialMediaResponse = {
        Google: () => {},
        Github: () => {},
        Twitter: () => {},
    };

    const CloseResponse = () => {};

    return (
        <DialogAuth
            open={true}
            textFieldVariant="outlined"
            onClose={CloseResponse}
            handleSignUp={SignUpResponse}
            handleForget={ForgetResponse}
            handleSignIn={SignInResponse}
            handleSocial={SocialMediaResponse}
        />
    );
        

};

export default Login;