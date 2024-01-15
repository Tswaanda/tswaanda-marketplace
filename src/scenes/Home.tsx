import { useEffect } from "react"
import Hero from "../components/Hero";
import Features from "../components/Features";
import About from "../components/About";
import Subscribe from "../components/Subscribe";
import styles from "../style";

const Home = () => {

    useEffect(() => {
        const element = document.getElementById(`main`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [])

    return (
        <div className={` ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
                <Hero />
                <Features />
                <About />
                <Subscribe />
            </div>
        </div>
    )
}

export default Home