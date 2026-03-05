import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeLoader = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const duration = 5000;
        const interval = 50;
        const increment = (interval / duration) * 100;

        const progressTimer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + increment;
                if (newProgress >= 100) {
                    clearInterval(progressTimer);
                    return 100;
                }
                return newProgress;
            });
        }, interval);

        const fadeOutTimer = setTimeout(() => {
            setFadeOut(true);
        }, duration - 500);

        const redirectTimer = setTimeout(() => {
            navigate('/erp/dashboard');
        }, duration);

        return () => {
            clearInterval(progressTimer);
            clearTimeout(fadeOutTimer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(253 253 253)',
            zIndex: 9999,
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease-out'
        }}>
            <div style={{
                textAlign: 'center',
                opacity: fadeOut ? 0 : 1,
                transform: fadeOut ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <img 
                    src="/loadervid.gif" 
                    alt="Loading..." 
                    style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        marginBottom: '50px',
                        opacity: 1,
                        animation: 'fadeInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
                
                <div style={{
                    width: '450px',
                    maxWidth: '85vw',
                    background: '#f5f5f5',
                    borderRadius: '50px',
                    overflow: 'hidden',
                    height: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                        borderRadius: '50px',
                        transition: 'width 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
                        animation: 'shimmer 2s infinite'
                    }} />
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    0% {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        filter: brightness(1);
                    }
                    50% {
                        filter: brightness(1.2);
                    }
                    100% {
                        filter: brightness(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default WelcomeLoader;
