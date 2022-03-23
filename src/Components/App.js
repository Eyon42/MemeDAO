import React from "react";
import { useState, useEffect } from "react";
import { profileHolder, provider } from '../wallet';

function App() {
    const [profileId, setProfileId] = useState('');
    const [signer, setSigner] = useState('');
    useEffect(async () => {
        const pid = (await profileHolder.profileId()).toNumber();
        const s = await provider.getSigner();
        setSigner(s)
        setProfileId(pid);
    }, [])

    return (
        <div>
            <h1>Hello World!</h1>
            Profile id: {profileId}
        </div>
    )
}

export default App;