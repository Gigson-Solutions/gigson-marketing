import a6Img from 'assets/brands/A6.svg';
import adockImg from 'assets/brands/Adock.svg';
import brandtiaImg from 'assets/brands/Brandtia.svg';
import caritasImg from 'assets/brands/Caritas.svg';
import colvinLogo from 'assets/brands/colvin.svg';
import elogiaImg from 'assets/brands/Elogia.svg';
import europcarGroupImg from 'assets/brands/EuropcarGroup.svg';
import kmmImg from 'assets/brands/KMM.svg';
import logoImg from 'assets/brands/Logo.svg';
import modareImg from 'assets/brands/Modare.svg';
import quicksmileLogo from 'assets/brands/quicksmile.svg';
import spainRevealedGisgsonImg from 'assets/brands/SpainRevealed_Gisgson.svg';
import stkImg from 'assets/brands/STK.svg';
import tarbozImg from 'assets/brands/Tarboz.svg';
import unavetsLogo from 'assets/brands/unavets.svg';
import vikoImg from 'assets/brands/Viko.svg';
import { Trans } from 'react-i18next';

const logoNames = [
  caritasImg,
  vikoImg,
  europcarGroupImg,
  logoImg,
  a6Img,
  kmmImg,
  elogiaImg,
  stkImg,
  adockImg,
  modareImg,
  spainRevealedGisgsonImg,
  brandtiaImg,
  tarbozImg,
  colvinLogo,
  unavetsLogo,
  quicksmileLogo,
];

const LogoGrid = () => {
  return (
    <div className="w-full flex flex-wrap gap-x-8 gap-y-6  md:gap-x-2 md:gap-y-6justify-items-center items-center">
      {logoNames.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Logo ${index + 1}`}
          className="max-w-full  h-[30px] lg:h-[55px] object-contain lg:p-2"
        />
      ))}
    </div>
  );
};

const Brand = () => (
  <section className="px-landing mt-fixed-navbar pb-14 lg:pb-40">
    <div className="max-w-[88.875rem] mx-auto">
      <div className="flex flex-col lg:flex-row w-full gap-15">
        <div className="  flex flex-col">
          <p className="text-h2  text-dark-primary mb-4 md:mb-6">
            <Trans
              i18nKey={'brand.brand_title'}
              components={{
                span: <span className="block text-purple-accents" />,
              }}
            />
          </p>
          <p className="text-dark-primary text-left text-subtitle max-w-contained mb-6 md:mb-10">
            <Trans
              i18nKey={'brand.brand_description'}
              components={{
                span: <span className="block text-purple-accents" />,
              }}
            />{' '}
          </p>
        </div>

        <div className=" lg:w-2/3 flex items-center justify-start">
          <LogoGrid />
        </div>
      </div>
    </div>
  </section>
);

export default Brand;
