import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
   const { i18n } = useTranslation();
   const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
   };

   useEffect(() => {
      console.log(i18n.language);
   }, []);

   return (
      <div style={{ display: "flex", alignItems: "center" }}>
         <ul style={{ cursor: "pointer" }}>
            <li className={i18n.language.includes("en") && "spam-lng"} onClick={() => changeLanguage("en")}>
               EN
            </li>
         </ul>
         <span style={{ marginInline: ".3rem" }}>/</span>
         <ul style={{ cursor: "pointer" }}>
            <li className={i18n.language.includes("es") && "spam-lng"} onClick={() => changeLanguage("es")}>
               ES
            </li>
         </ul>
      </div>
   );
};
export default LanguageSelector;
