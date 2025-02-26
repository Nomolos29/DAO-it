import React from "react";


interface CardProps {
  title: string;
  description: string;
  svgSrc: string
}

const Card: React.FC<CardProps> = ({ title, description, svgSrc }) => {
  return (
    <div className="w-full h-full rounded-[20px] overflow-hidden shadow-md bg-[#494445]">
      <div className={`w-full h-[60%] bg-gray-200 flex justify-center items-center`}>
        {/* <ReactSVG src={svgSrc} className="w-auto max-w-full" /> */}
        <img src={svgSrc} alt="image" width={0} height={0} className="w-[50%]" />
      </div>
      <div className="px-4 py-10 bg-[#494445] h-[40%] text-white rounded-b-lg">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm  mt-2">{description}</p>
      </div>
    </div>
  );
};

export default Card;
