import React, { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';
import { useAuth } from '../useAuth';

const Login = ({ loginDisplayed }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({reValidateMode: "onSubmit"});
    const [message, setMessage] = useState();
    const [isLoggingIn, setLoggingIn] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const onSubmit = async (loginCredentials, e) => {
        try {
            setLoggingIn(true);
            await auth.login(loginCredentials, () => {
                navigate('/project');
            });
            e.target.reset();
        } catch (error) {
            setMessage({ info: `${error.response.data.errors[0].msg}`, type: `warning` });
            setLoggingIn(false);
        }
    };

    return (
        <Fragment>
            {
                isLoggingIn &&
                <Dimmer active inverted>
                    <Loader id='landing-loader' inverted size='big'>Logging in...</Loader>
                </Dimmer>
            }
            <h4 className='box-title'>Log in to your account</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className='text-field-container'
                    type='text'
                    name='email'
                    {
                    ...register('email', {
                        required: 'Email is required.',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: 'Enter a valid e-mail address',
                        },
                    })}
                    placeholder='Enter email address'
                    onChange={() => clearErrors('email')}
                />
                {errors.email && <h5 className='error'>{errors.email.message}</h5>}
                <input className='text-field-container'
                    type='password'
                    name='password'
                    {
                    ...register('password', {
                        required: 'Password is required.',
                        minLength: {
                            value: 8,
                            message: 'Must exceed 8 characters.'
                        },
                    })}
                    placeholder='Enter password'
                    onChange={() => clearErrors('password')}
                />
                {errors.password && (
                    <h5 className='error'>{errors.password.message} </h5>
                )}
                {message && (
                    <div>
                        <h5 className={`${message.type}`} style={{marginTop:'20px'}}>{message.info}</h5>
                    </div>
                )}
                <button className='submit-button-landing' type='submit'>Log in</button>
            </form>
            <p className='underline-hover'
                onClick={() => {
                    loginDisplayed(false);
                }}
            >
                Don't have an account? Sign up here.
      </p>
        </Fragment>
    );
};

export default Login;