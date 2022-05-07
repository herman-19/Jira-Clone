import React, { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';
import { useAuth } from '../useAuth';

const Register = ({ loginDisplayed }) => {
    const { register, handleSubmit, formState: { errors }} = useForm({reValidateMode: "onBlur"});
    const [message, setMessage] = useState();
    const [isSigningUp, setSigningUp] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const onSubmit = async (registrationData, e) => {
        // Clear error message if displayed.
        try {
            setMessage('');
            setSigningUp(true);
            await auth.register(registrationData, () => {
                navigate('/project');
            });
            e.target.reset();
        } catch (error) {
            setMessage({ info: `${error.response.data.errors[0].msg}`, type: `warning` });
            setSigningUp(false);
        }
    };

    return (
        <Fragment>
            {
                isSigningUp &&
                <Dimmer active inverted>
                    <Loader id='landing-loader' inverted size='big'>Signing up...</Loader>
                </Dimmer>
            }
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
                        <h5 className={`${message.type}`} style={{marginTop:'20px'}}>{message.info}</h5>
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
