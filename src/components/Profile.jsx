import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Profile.module.css'
export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState({})
    const newNameRef = useRef('')
    const newPasswordRef = useRef('');
    const oldPasswordRef = useRef('');
    const [popUpMessage, setPopUpMessage] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [errors, setErrors] = useState({})
    const [fetchAgain,setfetchAgain] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        async function fetchUserData() {
            const response = await fetch('https://todoserver-68m5.onrender.com/api/v1/user/', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
            const data = await response.json();
            setData(data)
        }
        fetchUserData();
    }, [fetchAgain])

    async function updateUser(name, newpassword, oldpassword) {
        setErrors({});
        try {
            const response = await fetch('https://todoserver-68m5.onrender.com/api/v1/user/updateUser', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ name, newpassword, oldpassword })
            })
            const data = await response.json()
            if (!response.ok) {
                setErrors(prev => ({ ...prev, apiError: data.message || "Failed to update user!" }));
                return;
            }
            setPopUpMessage('Profile Updated Successfully!');
            setfetchAgain(prev=>!prev)
            setShowPopUp(true);
        }
        catch (err) {
            setErrors(prev => ({ ...prev, apiError: "Something went wrong!" }));
        }
        finally {
            setIsEditing(false);
        }

    }

    function updateUserHandler() {
        const newname = newNameRef.current.value;
        const newpassword = newPasswordRef.current.value;
        const oldpassword = oldPasswordRef.current.value;

        let newErrors = {};
        if (!oldpassword) newErrors.oldPassword = "Old password is required!";
        if (!newname && !newpassword) newErrors.general = "At least one field (name or password) must be updated.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        updateUser(newname, newpassword, oldpassword);
    }
    return (
        <>
            <div>
                {isEditing ?
                    <div className={styles.updateProfileCard}>
                        <h1 className={styles.updateHeading}>Update profile </h1>
                        <input
                            type="text"
                            placeholder={errors.general || 'Enter new name'}
                            ref={newNameRef}
                            className={errors.general ? styles.inputError : ""}
                            onChange={() => setErrors(prev => ({ ...prev, general: "" }))}
                        /> <p className={styles.or}>OR</p>

                        <input
                            type="password"
                            placeholder={errors.general || 'Enter new password'}
                            ref={newPasswordRef}
                            className={errors.general ? styles.inputError : ""}
                            onChange={() => setErrors(prev => ({ ...prev, general: "" }))}
                        /> <br />
                        <input
                            type="password"
                            placeholder={errors.oldPassword || 'Enter old password'}
                            ref={oldPasswordRef}
                            className={errors.oldPassword ? styles.inputError : ""}
                            onChange={() => setErrors(prev => ({ ...prev, oldPassword: "" }))}
                        /> <br />

                        <button onClick={updateUserHandler} className={styles.updateButton}>Save</button> <br />
                        <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancel</button>


                    </div>

                    :
                    <div className={styles.editcreds}>
                        <h3>Name: <span className={styles.smallText}>{data.name}</span></h3>
                        <h3>Username: <span className={styles.smallText}>{data.username}</span></h3>
                        <h3>Password: <span className={styles.smallText}>******</span></h3>
                        <button onClick={() => setIsEditing(true)} className={styles.editcredsbtn}>Edit Credentials</button>
                    </div>


                }
            </div>
            {showPopUp && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <p>{popUpMessage}</p>
                        <button onClick={() => setShowPopUp(false)}>OK</button>
                    </div>
                </div>
            )}
        </>
    )
}