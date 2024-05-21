import './Form.css'
import Button from './Button.jsx'
import { Link } from 'react-router-dom'


const Form = () => {
      

  return (
    <section className='form-section'>
        <h2 className='form-h2'>Ready to help you</h2>

        <form className='form' action="https://formsubmit.co/hola@somosgigson.com" method="POST">
            <div className="form-container">
                <div className='input-container'>
                    <label className='input-container-label'>My name is</label>
                    <input type="text" name='name' required placeholder='Name and lastname'/>
                </div>
                <div className='input-container'>
                <label className='input-container-label'>and I'm interested in</label>
                    <select type="text" name='service' required placeholder='Service'>
                        <option value="">Service</option>
                        <option value="1">Software engineering services</option>
                        <option value="2">Cibersecurity services</option>
                        <option value="3">Consulting services</option>
                    </select>
                </div>
                <div className='input-container'>
                    <label className='label-budget'>The budget for my idea is</label>
                    <div className="form-budget">
                        <input
                            type="radio"
                            id="budgetLess10K"
                            name="budget"
                            value="<10K"
                        />
                        <label htmlFor="budgetLess10K" className='form-btn-budget'>
                            &lt;10k€
                        </label>

                        <input
                            type="radio"
                            id="budgetLess25K"
                            name="budget"
                            value="<25K"
                        />
                        <label htmlFor="budgetLess25K" className='form-btn-budget'>
                            &lt;25k€
                        </label>

                        <input
                            type="radio"
                            id="budgetLess50K"
                            name="budget"
                            value="<50K"
                        />
                        <label htmlFor="budgetLess50K" className='form-btn-budget'>
                            &lt;50k€
                        </label>

                        <input
                            type="radio"
                            id="noIdea"
                            name="budget"
                            value="noIdea"
                        />
                        <label htmlFor="noIdea" className='form-btn-budget'>
                            no idea
                        </label>
                    </div>
                </div>
                <div className='input-container'>
                    <label className='input-container-label'>My email is</label>
                    <input type="email" name='email' required placeholder='name@example.com'/>
                </div>
                <div className='input-container input-container-text'>
                    <label htmlFor="text" className='input-container-label'>A short project description</label>
                    <input type="text" name='description' placeholder='Project details'/>
                </div>
                <div className='input-container form-check'>
                    <input type="checkbox" required className='input-radio'/>
                    <label htmlFor="checkbox">I have read the <Link className='legal-policity-form' to="politics">legal disclaimer</Link> and agree to the processing of my personal data.</label>
                </div>
                <input type="hidden" name="_captcha" value="false"></input>
                <input type="hidden" name="_template" value="box"></input>
            </div>  
            <Button type="submit" name='SEND' classStyle='form-btn-send'/>
        </form>
    </section>
  )
}

export default Form