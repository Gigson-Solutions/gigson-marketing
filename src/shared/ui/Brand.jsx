import {Link} from "react-router-dom";
import {Trans, useTranslation} from "react-i18next";




const logoNames = [ 'Caritas.png', 'STK.png',  'EuropcarGroup.png', 'Logo.png', 
                    'A6.png', 'Elogia.png',  'KMM.png','Viko.png',  'Adock.png',
                    'Modare.png', 'SpainRevealed_Gisgson.png','Brandtia.png',   'Tarboz.png'
                    ];

const LogoGrid = () => {
  return (
    <div className="w-full flex flex-wrap gap-x-8 gap-y-6  md:gap-x-2 md:gap-y-6justify-items-center items-center">
      {logoNames.map((name, index) => (
        <img
          key={index}
          src={`/src/assets/brands/${name}`} 
          alt={`Logo ${index + 1}`}
          className="max-w-full  h-[30px] lg:h-[46px] object-contain lg:p-2"
        />
      ))}
    </div>
  );
};

const Brand = ({title , description}) => {
    return (
        <section className="mt-fixed-navbar pt-14 lg:pt-40 pb-36 lg:pb-23">
            <div className="max-w-8xl mx-auto px-landing">
                <div className="flex flex-col lg:flex-row w-full gap-15">
            
                    <div className="  flex flex-col">
                        <p className="text-h2  text-dark-primary mb-4 md:mb-6">
                            <Trans
                                i18nKey={title}
                                components={{
                                span: <span className="block text-purple-accents" />,
                                }}
                            />
                        </p>
                        <p className="text-dark-primary text-left text-subtitle max-w-contained mb-6 md:mb-10"> {description} </p>
                    </div>

            
                    <div className=" lg:w-2/3 flex items-center justify-start">
                        <LogoGrid />
                    </div>
                </div>
             </div>
        </section>
        
    )


} 

export default Brand