import { useEffect, useState } from "react";

export default function SearchingAnimation() {

    const [dots, setDots] = useState("");

    useEffect(() => {

        const interval = setInterval(() => {

            setDots(prev => {

                if (prev.length >= 3) return "";

                return prev + ".";

            });

        }, 500);

        return () => clearInterval(interval);

    }, []);

    return (

        <h2>

            Finding Developers{dots}

        </h2>

    );

}