import React from 'react';
import { CheckCircleIcon, InformationCircleIcon, ArrowRightCircleIcon, LinkIcon } from '@heroicons/react/20/solid';

const Article = () => {
    return (
            <div className="bg-white px-6 py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                    <p className="text-base font-semibold leading-7 text-primary">Introduction</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Understanding HS Codes for Fruits and Vegetables</h1>
                    <h2 className="text-2xl pt-6 font-bold tracking-tight text-gray-900">What are HS Codes?</h2>
                    <p className="mt-6 text-xl leading-8">
                        HS Codes, or Harmonized System codes, are a global standard for classifying and categorizing products in international trade. These codes consist of numerical sequences assigned to specific products, allowing customs authorities, businesses, and governments to identify and regulate goods as they cross international borders.
                    </p>

                    <h2 className="text-2xl pt-6 font-bold tracking-tight text-gray-900">Why are HS Codes Important for Fruits and Vegetables?</h2>
                    <div className="mt-10 max-w-2xl">
                    <p>
                        HS codes play a vital role in international trade for fruits and vegetables:
                    </p>
                    <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                        <li className="flex gap-x-3">
                        <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                        <span>
                            <strong className="font-semibold text-gray-900">Customs Clearance:.</strong> Accurate HS codes are crucial for smooth customs clearance. They determine the applicable tariffs, duties, and regulatory requirements for your products.
                        </span>
                        </li>
                        <li className="flex gap-x-3">                        <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                        <span>
                            <strong className="font-semibold text-gray-900">Market Access:</strong> Understanding HS codes helps you navigate import/export regulations and gain access to international markets.
                        </span>
                        </li>
                        <li className="flex gap-x-3">
                        <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                        <span>
                            <strong className="font-semibold text-gray-900">Product Identification:</strong> HS codes provide a standardized way to identify and describe your fruits and vegetables when trading globally.
                        </span>
                        </li>
                    </ul>

                    <h2 className="text-2xl pt-6 font-bold tracking-tight text-gray-900">Why are HS Codes Important for Fruits and Vegetables?</h2>

                    <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                        <li className="flex gap-x-3">
                            <ArrowRightCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                            <span>
                                <strong className="font-semibold text-gray-900">Consult the Official HS Nomenclature:</strong> The World Customs Organization (WCO) maintains the official HS Nomenclature, which you can access online. This resource provides detailed information on HS codes and their descriptions. <br />
                                <a className='text-blue-500' href="https://www.wcoomd.org/en/topics/nomenclature/instrument-and-tools/hs-nomenclature-2022-edition.aspx">World Customs Organization HS Nomenclature</a>
                            </span>
                        </li>
                        <li className="flex gap-x-3">                        
                            <ArrowRightCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                            <span>
                                <strong className="font-semibold text-gray-900">Use Customs Authorities' Websites:</strong> Many countries' customs authorities provide online databases to help businesses find the correct HS codes for their products. You can check with your own country's customs website or the customs authority of the country you are trading with.
                            </span>
                        </li>
                        <li className="flex gap-x-3">
                            <ArrowRightCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                            <span>
                                <strong className="font-semibold text-gray-900">Third-Party HS Code Databases: </strong>Several third-party websites and tools offer HS code lookup services. While these can be helpful, it's always a good idea to cross-reference with official sources for accuracy. <br />
                                <a className='text-blue-500' href="https://hts.usitc.gov/">HS Code Search</a> <br />
                                <a className='text-blue-500' href="https://www.importgenius.com/hs-code-search">HS Code Lookup by Import Genius</a>
                            </span>
                        </li>
                    </ul>
                    
                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Verifying HS Codes</h2>
                    <p className="mt-6">
                        It's essential to verify the accuracy of HS codes to ensure compliance with customs regulations. Here's how you can do it:
                    </p>
                        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                            <li className="flex gap-x-3">                        
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Consult Customs Experts:</strong>  If you're uncertain about the HS code for your products, consult with customs experts or seek assistance from customs brokers.
                                </span>
                            </li>
                            <li className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold text-gray-900">Cross-Check with Official Sources:  </strong> Always cross-check the HS code you find with the official sources mentioned above to ensure accuracy.
                                </span>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="mt-16 max-w-2xl">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Conclusion</h2>
                    <p className="mt-6">
                        Understanding and correctly using HS codes is essential for a successful fruits and vegetables marketplace. These codes enable you to navigate international trade regulations, accurately describe your products, and ensure smooth customs processes.
                    </p>
                    <p className="mt-8">
                        For specific guidance on HS codes for your products or regions you're trading with, consult the official sources and customs authorities to ensure compliance with local and international regulations.
                    </p>
                    <p className='mt-6'>
                        If you have further questions or need assistance, please don't hesitate to contact our <a className='text-blue-500' href="mailto:contact@tswaanda.com">support team</a> for help with HS code classification.
                    </p>
                    </div>
                </div>
            </div>
    )
};

export default Article;

