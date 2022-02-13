import React, { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// import { userRegistration } from '../api/UserAPI';

const Register = ({ loginDisplayed }) => {
    // const { register, handleSubmit, errors } = useForm();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState();
    const navigate = useNavigate();

    const onSubmit = async (registrationData, e) => {
        // try {
        //     const data = await userRegistration(registrationData);
        //     localStorage.setItem('token', data.token);
        //     setMessage({ info: `Creating new account...`, type: `success` });
        //     e.target.reset();
        //     setTimeout(() => {
        //         navigate('/dashboard');
        //     }, 1000);
        // } catch (error) {
        //     const errMsg = error.response.data.errors[0].msg;
        //     setMessage({ info: `${errMsg}`, type: `warning` });
        // }
    };

    return (
        <Fragment>
            <h4 className="box-title">Sign up for your account</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className="text-field-container"
                    type="text"
                    name="email"
                    {
                    ...register("email", {
                        required: "Email is required.",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: "Enter a valid e-mail address",
                        },
                    })}
                    placeholder="Enter email address"
                />
                {errors.email && <h5 className="error">{errors.email.message}</h5>}
                <input className="text-field-container"
                    name="name"
                    type="text"
                    {
                    ...register("name", {
                        required: "Name is required"
                    })}
                    placeholder="Enter full name"
                />
                {errors.name && <h5 className="error">{errors.name.message}</h5>}
                <input className="text-field-container"
                    type="password"
                    name="password"
                    {
                    ...register("password", {
                        required: "Password is required.",
                        minLength: {
                            value: 8,
                            message: "Must exceed 8 characters.",
                        },
                    })}
                    placeholder="Enter password"
                />
                {errors.password && (
                    <h5 className="error">{errors.password.message} </h5>
                )}
                {message && (
                    <div>
                        <h5 className={`${message.type}`}>{message.info}</h5>
                    </div>
                )}
                <button className="submit-button-landing" type="submit">Sign up</button>
            </form>
            <p className="underline-hover"
                onClick={() => {
                    loginDisplayed(true);
                }}
            >
                Already have a Jira account? Log in
      </p>
        </Fragment>
    );
};

export default Register;
