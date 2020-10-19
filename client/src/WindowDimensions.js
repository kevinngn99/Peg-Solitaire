import { useState, useEffect } from 'react';

function WindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowDimensions;
}

export default WindowDimensions;
