import React from "react";
import { Link } from "react-router-dom";

interface ProductProps {
    id: string,
    image: string,
    type: string,
    desc: string
}

const ProductCard = ({ 
    id,
    image,
    type,
    desc
}: ProductProps) => {

    return (
        <div className="flex flex-col relative bg-productBg w-64 lg:w-72 h-80 justify-start items-center p-0 px-8 box-border rounded-[12px] md:mx-8 mb-14">
            <div className="absolute -top-8 w-60">
                <div className="flex flex-col w-full items-center isolate p-0 box-border">
                    <img
                        src={image}
                        loading="lazy"
                        alt={type}
                        className="h-40 w-52 m-0"
                    />
                </div>
                <div className="flex flex-col justify-start items-start p-0 px-6 lg:px-0 border-box mt-4">
                    <h1 className="text-left whitespace-pre-wrap font-semibold text-primary text-2xl leading-none m-0">
                        {type}
                    </h1>
                    <h3 className="text-left text-black font-light font-xs text leading-none m-0 mt-2">
                        {desc}
                    </h3>
                </div>
                <div className="flex flex-row justify-center items-end p-0 px-6 lg:px-0 mt-9 box-border">

                    <Link 
                        to={`../product/${String(id)}`} 
                        className="bg-primary hover:bg-gray-400 w-5/6 rounded-[12px] flex isolate justify-center items-start p-2  text-white text-xl box-border"
                    >
                        View Deal
                    </Link>
                </div>
            </div>
        </div>
    );  
}

export default ProductCard;
