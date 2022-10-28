import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import { Navigate } from 'react-router-dom';
import Private from './Private';
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from './api/axios';
const LOGIN_URL = 'http://localhost:3333/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const Logout = () => {
      const handleClick = e => {
        setAuth({accessToken: null})
        setSuccess(false)
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
      <div className="modal">
        <div className='login'>
            {success ? 
            <Private logout={Logout} pwd user/>
            : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Log In</h1>
                    <form onSubmit={handleSubmit}>
                      <div className='row'>
                      <FontAwesomeIcon className='icon' icon={ faUser }/>
                        <input
                            type="text"
                            placeholder='Username'
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />
                      </div>
                      <div className='row'>
                      <FontAwesomeIcon className='icon' icon={ faLock }/>
                        <input
                            type="password"
                            placeholder='Password'
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                      </div>
                      <div className='row'>
                        <button>Sign In</button>
                      </div>
                      <div className="link">Not a member?&nbsp;
                        <a href='/register' onClick={()=>{
                          return (
                            <Navigate to={`/register`}/>
                          )
                        }}>
                          Sign up
                        </a> now
                      </div>
                    </form>
                </section>
            )}
        </div>
      </div>
    )
}

export default Login
