import "./Form.css";
import Button from "./Button.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Form = ({ customClass }) => {
   const { t } = useTranslation();
   const { title, name, service, budget, email, details, send, checkbox } = t("form");

   return (
      <section className={`${customClass} form-section`}>
         <h2 className="form-h2">{title}</h2>
         <form className="form" action="https://formsubmit.co/jaume@somosgigson.com" method="POST">
            <div className="form-container">
               <div className="input-container first">
                  <label className="input-container-label">{name.label}</label>
                  <input type="text" name="name" required placeholder={name.placeholder} />
               </div>
               <div className="input-container second">
                  <label className="input-container-label ">{service.label}</label>
                  <select type="text" name="service" required placeholder={service.placeholder}>
                     <option value="">{service.placeholder}</option>
                     <option value={service.services[0]}>{service.services[0]}</option>
                     <option value={service.services[1]}>{service.services[1]}</option>
                     <option value={service.services[2]}>{service.services[2]}</option>
                  </select>
               </div>
               <div className="input-container">
                  <label className="label-budget">{budget.label}</label>
                  <div className="form-budget">
                     <input type="radio" id="budgetLess10K" name="budget" value="<10K" />
                     <label htmlFor="budgetLess10K" className="form-btn-budget">
                        &lt;10k€
                     </label>

                     <input type="radio" id="budgetLess25K" name="budget" value="<25K" />
                     <label htmlFor="budgetLess25K" className="form-btn-budget">
                        &lt;25k€
                     </label>

                     <input type="radio" id="budgetLess50K" name="budget" value="<50K" />
                     <label htmlFor="budgetLess50K" className="form-btn-budget">
                        &lt;50k€
                     </label>

                     <input type="radio" id="noIdea" name="budget" value="noIdea" />
                     <label htmlFor="noIdea" className="form-btn-budget">
                        {budget.placeholder}
                     </label>
                  </div>
               </div>
               <div className="input-container">
                  <label className="input-container-label">{email.label}</label>
                  <input type="email" name="email" required placeholder={email.placeholder} />
               </div>
               <div className="input-container input-container-text">
                  <label htmlFor="text" className="input-container-label">
                     {details.label}
                  </label>
                  <input id="input-description" type="text" name="description" placeholder={details.placeholder} />
               </div>
               <div className="input-container form-check">
                  <input type="checkbox" required className="input-radio" />
                  <label htmlFor="checkbox">
                     {checkbox.first}
                     <Link
                        className="legal-policity-form"
                        to="/policity"
                        onClick={(e) => {
                           e.preventDefault(); // Previene la navegación normal del <Link>
                           window.open("/policity", "_blank");
                        }}
                     >
                        {checkbox.second}
                     </Link>
                     {checkbox.third}
                  </label>
               </div>
               <input type="hidden" name="_captcha" value="false"></input>
               <input type="hidden" name="_template" value="box"></input>
            </div>
            <Button type="submit" name={send} classStyle="form-btn-send" />
         </form>
      </section>
   );
};

export default Form;
