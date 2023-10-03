

const About = () => {
    return (
        <section className="">
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <img 
                    className="m-0 w-full rounded-xl" 
                    src="./farmer.png"
                    alt="farmer" 
                />
                <div className="mt-4 md:mt-0">
                    <h1 className="lg:text-left sm:text-center  text-primary font-bold text-4xl mb-4">
                        About Us
                    </h1>
                    <h2 className="mb-4 md:text-2xl tracking-tight font-semibold text-black ">
                        We always prioritize efficiency without compromising quality.
                    </h2>
                    <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                        Tswaanda is dedicated to providing our customers with professional
                        services for economic utilisation of the major markets for
                        agriculture. We speak directly to the farmers’ pains by being a
                        complete commercial platform that helps farmers grow and manage
                        their farming business..
                    </p>
                    <a href="#" className="inline-flex items-center text-primary bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Get started
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default About;
