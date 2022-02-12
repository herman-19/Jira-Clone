import React, { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';

const Login = ({ loginDisplayed }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState();

    const onSubmit = (loginCredentials, e) => {
        try {
            console.log('Logging in...');
            setMessage({ info: `Logging in...`, type: `success` });
        } catch (error) {
            setMessage({ info: `${error}`, type: `warning` });
        }
    };

    return (
        <Fragment>
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
                />
                {errors.email && <h5 className='error'>{errors.email.message}</h5>}
                <input className='text-field-container'
                    type="password"
                    name="password"
                    {
                    ...register('password', {
                        required: 'Password is required.',
                        minLength: {
                            value: 6,
                            message: 'Must exceed 6 characters.'
                        },
                    })}
                    placeholder='Enter password'
                />
                {errors.password && (
                    <h5 className="error">{errors.password.message} </h5>
                )}
                {message && (
                    <div>
                        <h5 className={`${message.type}`}>{message.info}</h5>
                    </div>
                )}
                <button className="submit-button-landing" type="submit">Log in</button>
            </form>
            <p className="underline-hover"
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