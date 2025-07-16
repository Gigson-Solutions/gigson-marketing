import {Link} from "react-router-dom";
import {Trans, useTranslation} from "react-i18next";




const logoNames = [ 'Caritas.png', 'stk.png',  'Europcar.png', 'Mudanza.png', 
                    'A6.png','Elogia.png',  'KMM.png','Viko.png',  'Adock.png','Moda.png', 'SpainRevealed.png','Brandita.png',   'Tarboz.png'
];

const LogoGrid = () => {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-8 justify-items-center items-center">
      {logoNames.map((name, index) => (
        <img
          key={index}
          src={`/src/assets/brands/${name}`} 
          alt={`Logo ${index + 1}`}
          className="max-w-full max-h-[75px] object-contain p-2"
        />
      ))}
    </div>
  );
};

const Brand = ({title , description}) => {
    return (
        <section className="mt-fixed-navbar pt-14 lg:pt-40 pb-36 lg:pb-23">
            <div className="max-w-full mx-auto px-landing flex flex-row items-center">
                <div className="flex flex-col lg:flex-row w-full gap-15">
            
                    <div className="w-full lg:w-1/3 flex flex-col items-center justify-center text-center">
                        <h1 className="text-h1 text-dark-primary mb-4 md:mb-6">
                            <Trans
                                i18nKey={title}
                                components={{
                                span: <span className="block text-purple-accents" />,
                                }}
                            />
                        </h1>
                        <p className="text-dark-primary text-subtitle max-w-contained mb-6 md:mb-10"> {description} </p>
                    </div>

            
                    <div className="w-full lg:w-2/3 flex items-center justify-start">
                        <LogoGrid />
                    </div>
                </div>
             </div>
        </section>
        
    )


} 

export default Brand