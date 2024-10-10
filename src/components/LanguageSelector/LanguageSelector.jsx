import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
   const { i18n } = useTranslation();
   const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
   };

   return (
      <div style={{ display: "flex", alignItems: "center" }}>
         <ul style={{ cursor: "pointer" }}>
            <li className={"en" === i18n.language && "spam-lng"} onClick={() => changeLanguage("en")}>
               EN
            </li>
         </ul>
         <span style={{ marginInline: ".3rem" }}>/</span>
         <ul style={{ cursor: "pointer" }}>
            <li className={"es" === i18n.language && "spam-lng"} onClick={() => changeLanguage("es")}>
               ES
            </li>
         </ul>
      </div>
   );
};
export default LanguageSelector;
