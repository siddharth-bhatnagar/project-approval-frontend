import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { database } from '../../firebase/firebase';
import Navbar from '../Navbar/Navbar';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

import ProfileImage from './Images/Profile.png'

// Styles
import './Profile.css'

export default function Profile() {

    const { currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = database.users.doc(currentUser.uid).onSnapshot((doc) => {
            setUserData(doc.data());
        });
        return unsubscribe;
    }, [currentUser]);

    const TextField = ({ label, ...props }) => {
        const [field, meta] = useField(props);
        return (
            <>
                <label htmlFor={props.id || props.name}>{label}</label>
                <input className="text-input" {...field} {...props} />
                {/* To be managed while styling */}
                {/* {meta.touched && meta.error ? (
                    <div className="error">{meta.error}</div>
                ) : null} */}
            </>
        );
    };

    const Spinner = ({ label, ...props }) => {
        const [field, meta] = useField(props);
        return (
            <div>
                <label htmlFor={props.id || props.name}>{label}</label>
                <select {...field} {...props} />
                {/* {meta.touched && meta.error ? (
                    <div className="error">{meta.error}</div>
                ) : null} */}
            </div>
        );
    };

    const handleSave = async (values, role) => {
        console.log(values);
        setLoading(true);
        if (role === 1) {
            await database.users.doc(currentUser.uid).update({
                username: userData?.username !== values.Name ? values.Name : userData?.username,
                college: userData?.college !== values.College ? values.College : userData?.college,
                degree: userData?.degree !== values.Degree ? values.Degree : userData?.degree,
                branch: userData?.branch !== values.Branch ? values.Branch : userData?.branch,
                eno: userData?.eno !== values.Enroll ? values.Enroll : userData?.eno,
            });
        }
        else {
            await database.users.doc(currentUser.uid).update({
                username: userData?.username !== values.Name ? values.Name : userData?.username,
                college: userData?.college !== values.College ? values.College : userData?.college,
            });
        }

        setLoading(false);
        setEditable(false);
    }

    return (
        <>
            {userData === null ?
                <LoadingScreen />
                :
                <>
                    <Navbar role={userData?.role} />
                    <div className="Profile">
                        <div className="Profile-container">
                            <div className="Profile-header">
                                <img src={ProfileImage} alt="profile" className="Profile-img" />
                                <h1 style={{ color: "white" }}>{userData?.username}</h1>
                                <h3 style={{ color: "rgba(255, 255, 255, 0.5)", paddingBottom: "20px" }}>{userData?.email}</h3>
                            </div>
                            <div className="Profile-body">
                                {editable === false ?
                                    <>
                                        <div className="Profile-data">
                                            <h3><span>College: </span>{userData?.college}</h3>
                                            <h3><span>Role: </span>{userData?.role === 1 ? <>Student</> : userData?.role === 2 ? <>Teacher</> : <></>}</h3>
                                            <h3>{userData?.role === 1 ? <><span>Degree: </span>{userData?.degree}</> : <></>}</h3>
                                            <h3>{userData?.role === 1 ? <><span>Branch: </span>{userData?.branch}</> : <></>}</h3>
                                            <h3>{userData?.role === 1 ? <><span>Enrollment No: </span>{userData?.eno}</> : <></>}</h3>
                                            <button
                                                onClick={() => setEditable(!editable)}
                                                className="Profile-edit-btn"
                                            >
                                                <h3>Edit Profile</h3>
                                            </button>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {userData?.role === 1 ?
                                            <>
                                                <Formik
                                                    initialValues={{
                                                        Name: userData?.username,
                                                        College: userData?.college,
                                                        Degree: userData?.degree,
                                                        Branch: userData?.branch,
                                                        Enroll: userData?.eno,
                                                    }}

                                                    onSubmit={(values) => {
                                                        handleSave(values, 1);
                                                    }}
                                                >
                                                    <Form
                                                        className="Profile-edit-form"
                                                    >
<div className="Fname">                                                       <TextField 
                                                            label="Name "
                                                            name="Name"
                                                            type="text"
                                                            placeholder="Jane Doe"
                                                        />
</div>
<div className="College">
                                                        <Spinner label="College " name="College">
                                                        
                                                            <option  value="">Select your college</option>
                                                            <option value="MSIT">Maharaja Surajmal Institute of Technology</option>
                                                        
                                                        </Spinner>
</div>
<div className="Degree">
                                                        <Spinner label="Degree " name="Degree">
                                                       
                                                             <option value="">Select your degree</option>
                                                            <option value="B.Tech">Bachelor of Technology</option>
                                                            <option value="B.E">Bachelor of Engineering</option>
                                                        
                                                        </Spinner>
</div>
                                                        <div className="Branch">
                                                        <Spinner label="Branch " name="Branch">
                                                       
                                                            <option value="">Select your branch</option>
                                                            <option value="CSE">Computer Science & Engineering</option>
                                                            <option value="IT">Information Technology</option>
                                                            <option value="ECE">Electronics & Communication Engineering</option>
                                                            <option value="EEE">Electrical & Electronics Engineering</option>
                                                       
                                                        </Spinner>
</div>
<div className="Enroll">
                                                        <TextField
                                                            label="Enrollment No "
                                                            name="Enroll"
                                                            type="number"
                                                            placeholder="12345678910"
                                                        />
</div>
                                                        <div className="Profile-btn-grp">
                                                            <button
                                                                onClick={() => setEditable(!editable)}
                                                                className="Profile-edit-cancel"
                                                            >
                                                                <h3>Cancel</h3>
                                                            </button>
                                                            <button
                                                                disabled={loading}
                                                                type="submit"
                                                                className="Profile-edit-save"
                                                            >
                                                                <h3>Save</h3>
                                                            </button>
                                                        </div>
                                                    </Form>
                                                </Formik>
                                            </>
                                            :
                                            <>
                                                <Formik
                                                    initialValues={{
                                                        Name: userData?.username,
                                                        College: userData?.college,
                                                    }}

                                                    onSubmit={(values) => {
                                                        handleSave(values, 2);
                                                    }}
                                                >
                                                    <Form
                                                        className="Profile-edit-form"
                                                    >
                                                        <TextField className="Fname"
                                                            label="Name "
                                                            name="Name"
                                                            type="text"
                                                            placeholder="Jane Doe"
                                                        />

                                                        <Spinner  label="College " name="College">
                                                            <option value="">Select your college</option>
                                                            <option value="MSIT">Maharaja Surajmal Institute of Technology</option>
                                                        </Spinner>
                                                  
                                                        <div className="Profile-btn-grp">
                                                            <button
                                                                onClick={() => setEditable(!editable)}
                                                                className="Profile-edit-cancel"
                                                            >
                                                                <h3>Cancel</h3>
                                                            </button>
                                                            <button
                                                                disabled={loading}
                                                                type="submit"
                                                                className="Profile-edit-save"
                                                            >
                                                                <h3>Save</h3>
                                                            </button>
                                                        </div>
                                                    </Form>
                                                </Formik>
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
