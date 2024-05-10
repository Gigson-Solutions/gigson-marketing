import React from 'react';
import heroImg from '../../assets/HeroServices.png';
import {Link} from 'react-router-dom'
import './Services.css';

const Services = () => {
  const servicesData = [
    {
      title: 'Software engineering services',
      description: 'From integrating different tools, developing new features and products until monitoring and maintaining a product, our team is ready for it. Our software engineering team is composed by developers, architects and testers to build any need with the best cutting-edge technologies.',
      cards: [
        {
          title: 'Cloud Provider',
          description: 'Amazon AWS, Microsoft Azure, GCP.'
        },
        {
          title: 'Containers & Orchestration',
          description: 'Docker, K8s, WPAR & others.                                  '
        },
        {
          title: 'CI/CD',
          description: 'Jenkins, GitLab, GitHub, Git.'
        },
        {
          title: 'Database',
          description: 'Oracle, MySQL, Mango DB, PostgresSQl, MS SQL & others.'
        },
        {
          title: 'Services',
          description: 'RabbitMQ, Apache Kafka, Apache, Redis, ELK stack & others.'
        },
        {
          title: 'Monitoring',
          description: 'Prometheus, Datalog, Grafana,Azure monitor, Amazon CloudWatch, Zabbix & others.'
        },
      ]
    },
    {
      title: 'Cybersecurity services',
      description: 'Information Security is not longer in the roadmap. Cybersecurity is a MUST in every business and all companies should have the knowledge, tools and processes to avoid or minimize attacks.',
      cards: [
        {
          title: 'Security Assessment',
          description: 'Vulnerabilities analysis, Remediation report, Application Security Assessments'
        },
        {
          title: 'Training',
          description: 'Phising and information security training'
        },
        {
          title: 'Security Transformations',
          description: 'As Is/To Be assessments, IT transformation'
        },
      ]
    },
    {
      title: 'Consulting services',
      description: 'Nuestro equipo de ingenieros de software, arquitectos y desarrolladores experimentados utiliza las mejores tecnologías adaptadas a tu industria. Gigson solutions es tu socio de confianza en el desarrollo de software. Entendemos que detrás de cada línea de código hay una oportunidad para obtener una ventaja competitiva.',
      cards: [
        {
          title: 'CTO As A Service',
          description: 'Vulnerabilities analysis, Remediation report, Application Security Assessments'
        },
        {
          title: 'Project Management',
          description: 'Project execution, Risk Analysis, Providers management.'
        },
        {
          title: 'Product Management',
          description: 'E2E overview, SLAs management'
        },
        {
          title: 'Technology Consulting',
          description: 'Technical questions about languages, architectures and solutions.'
        },
        {
          title: 'UX/UI Consulting',
          description: 'User Experience and User Interface consulting.'
        },
      ]
    },
  ];

  
  // useEffect(() => {
  //   // Define la longitud máxima deseada para las descripciones
  //   const maxLength = 10;

  //   // Ajusta la longitud de todas las descripciones
  //   const allDescriptions = servicesData.flatMap(data => [
  //     data.description,
  //     ...data.cards.map(card => card.description)
  //   ]);

  //   const descriptionsWithSpaces = allDescriptions.map(description => {
  //     const length = description.length;
  //     if (length < maxLength) {
  //       const spacesToAdd = maxLength - length;
  //       return description + ' '.repeat(spacesToAdd);
  //     } else if (length > maxLength) {
  //       return description.slice(0, maxLength);
  //     } else {
  //       return description;
  //     }
  //   });

  //   // Actualiza las descripciones en el estado
  //   let dataIndex = 0;
  //   servicesData.forEach(data => {
  //     data.description = descriptionsWithSpaces[dataIndex++];
  //     data.cards.forEach(card => {
  //       card.description = descriptionsWithSpaces[dataIndex++];
  //     });
  //   });
  // }, []);

  return (
    <div className='services'>
      <img src={heroImg} alt="" className='hero-services-img'/>
      <section className='hero-services'>
        <p className='hero-services-p'>building tailored software solutions</p>
        <h1 className='hero-services-h1'>Discover all <span>our services</span></h1>
      </section>
      <section className='services-container'>
        {servicesData.map(({title, description, cards}, i) => 
          <div key={i} className={`services-cards services-card-${i}`}>
            <header className='services-cards-top'>
              <h2>{title}</h2>
              <p>{description}</p>
            </header>
            
            <footer className='service-footer'>
              {cards.map(({title, description}, index) =>
                <div key={index} className='services-card-bottom'>
                  <div>
                    <span className='services-cards-span'>0{index + 1}</span>
                    <h3 className='services-cards-h3'>{title}</h3>
                  </div>
                  <p className='services-cards-p'>{description}</p>
                </div>
              )}
            </footer>
          </div>
        )}
      </section>

      <section className='why-gigson'>
        <h2>Why choosing Gigson Solutions</h2>
        <div>
          <p>We don't develop just an App or a Web. We build complex and and unique solutions for your business.</p>
          <Link to='/contact' className='button-main why-gigson-btn'>LET'S TALK</Link>
        </div>
      </section>
    </div>
  );
}

export default Services;
