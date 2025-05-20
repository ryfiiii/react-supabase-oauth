import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleGitHubLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });
        if (error) console.log('Error:', error.message);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log('Error:', error.message);
    };

    return (
        <div className="App" style={{ padding: '50px' }}>
            {!session ? (
                <button onClick={handleGitHubLogin}>GitHubでログイン</button>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <h2>ログイン成功！</h2>
                    {session.user.user_metadata.avatar_url && (
                        <img
                            src={session.user.user_metadata.avatar_url}
                            alt="GitHub Avatar"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                marginBottom: '20px'
                            }}
                        />
                    )}
                    <p>ユーザー名: {session.user.user_metadata.user_name || session.user.email}</p>
                    <button onClick={handleLogout}>ログアウト</button>
                </div>
            )}
        </div>
    );
}

export default App;
