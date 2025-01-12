import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
   .use(LanguageDetector)
   .use(initReactI18next)
   .init({
      debug: false,
      fallbackLng: "en",
      returnObjects: true,
      resources: {
         en: {
            translation: {
               menu: {
                  services: "SERVICES",
                  cases: "CASES",
                  about: "ABOUT",
                  faqs: "FAQs",
                  contact: "CONTACT US",
                  legal: "Legal Policy",
                  cookies: "Cookies Policy",
                  notice: "Legal Notice",
               },
               home: {
                  heroH1: "Making technology <span>boost</span> your business<span>.</span>",
                  heroP: "BUILDING TAILORED SOFTWARE SOLUTIONS",
                  heroBtn: "CONTACT US",
                  heroScroll: "GO DOWN TO EXPORE",
                  servicesTitle: "Tailored <span>solutions</span> for any business ·",
                  servicesP: {
                     p1: "We are focused to leverage the technology to  your business, connecting and making it secure to align needs and business goals.",
                     p2: "And if your solution does not exist yet, let's build it together.",
                  },
                  servicesBtn: "DISCOVER OUR SERVICES",
               },
               ctas: {
                  contact: "CONTACT US",
                  talk: "LET’S TALK",
               },
               caseswhygigson: {
                  wth2: "What can Gigson Solutions do for your business?",
                  wp1: "At Gigson Solutions, we believe that technology should drive your business forward, not limit it.",
                  wp2: "Here are some examples of what we can do for you.",
                  wlink: "VIEW CASES",
               },
               whyservices: {
                  sth2: "Simplifying a needless complex world.",
                  slink: "SEE SERVICES",
               },
               about: {
                  title: "Our team is built by professionals with more than <span>9 years</span> of experience.",
                  description:
                     "We have the required profiles to face the end-to-end digital product development to offer an all-in-one service.",
                  cta: "LET’S TALK",
                  titleH2: "What be believe",
                  belive: {
                     t1: "Quality",
                     t2: "Commitment",
                     t3: "Security",
                     p1: "Regardless of whether we're crafting a proof of concept or a final product, we apply various product quality and project management standards to ensure that every product meets and exceeds expectations.",
                     p2: "You'll have the flexibility to choose the level of engagement you prefer with us. We'll always be by your side to support you at any stage, but if you decide not to continue, we'll handle the closure and necessary handover, complying with all current legal requirements.",
                     p3: "Security is essential to us. We offer the ability to audit and certify our cloud solutions with CIS, CISA, FedRAMP, PCI-DSS, GDPR, FFIEC, and SOC2.",
                  },
                  need: {
                     t: "What do I need to build a <span>Digital product</span>?",
                     d: "Develop a software product is much more than just building physical product or running a project. This type of products require full attention and knowledge in different areas to avoid costs overrun or technology limitations.",
                     specialist1: "WHO MANAGE THE PRODUCT",
                     specialist2: "WHO CODES ALMOST EVERYTHING",
                     specialist3: "WHO DESIGN THE SOLUTION",
                     specialist4: "WHO CODES HOW THE PRODUCT WORKS",
                     specialist5: "WHO THINKS ABOUT THE BUSINESS",
                     specialist6: "WHO CODES WHAT YOU SEE",
                     specialist7: "WHO VALIDATES",
                     specialist8: "WHO DESIGN WHAT YOU FEEL",
                     specialist9: "WHO SECURE THE PRODUCT",
                     label: "*Not all of these roles are necessary in all products. Wisely selection is needed depending on needs and sectors.",
                     cta2: "CONTACT US",
                  },
               },
               service: {
                  serviceH1: "Discover all <span>our services</span>",
                  serviceP: "BUILDING TAILORED SOFTWARE SOLUTIONS",
               },
               serviceCard: [
                  {
                     title: "Cybersecurity services",
                     description:
                        "Information Security is not longer in the roadmap. Cybersecurity is a MUST in every business and all companies should have the knowledge, tools and processes to avoid or minimize attacks.",
                     cards: [
                        {
                           title: "Security Assessment",
                           description: "Vulnerabily & risk assessment, Remediation report, Application Security Assessments",
                        },
                        {
                           title: "Training",
                           description: "Phising and information security training",
                        },
                        {
                           title: "Security Transformations",
                           description: "As Is/To Be assessments, IT transformation",
                        },
                     ],
                  },
                  {
                     title: "Software engineering services",
                     description:
                        "From integrating different tools, developing new features and products until monitoring and maintaining a product, our team is ready for it. Our software engineering team is composed by developers, architects and testers to build any need with the best cutting-edge technologies.",
                     cards: [
                        {
                           title: "Cloud Provider",
                           description: "AWS, Microsoft Azure, GCP.",
                        },
                        {
                           title: "Containers & Orchestration",
                           description: "Docker, K8s, WPAR & others.                                  ",
                        },
                        {
                           title: "CI/CD",
                           description: "Jenkins, GitLab, GitHub Actions, Git.",
                        },
                        {
                           title: "Database",
                           description: "Oracle, MySQL, Mango DB, PostgresSQL, MS SQL & others.",
                        },
                        {
                           title: "Messaging & Data Streaming",
                           description: "RabbitMQ, Apache Kafka, Apache, Redis, ELK stack & others.",
                        },
                        {
                           title: "Monitoring",
                           description: "Prometheus, Datalog, Grafana,Azure monitor, Amazon CloudWatch, Zabbix & others.",
                        },
                     ],
                  },
                  {
                     title: "Consulting services",
                     description:
                        "The provided graphic outlines consulting services offered by a team with technical expertise in software engineering, including roles like interim CTO, project and product management, and specialized consulting in technology, UX, and UI to enhance business and project outcomes.",
                     cards: [
                        {
                           title: "CTO As A Service",
                           description: "Outsourcing of technical and business leadership for engineering and product areas.",
                        },
                        {
                           title: "Project Management",
                           description: "Project supervision, Risk Analysis, Vendor Management.",
                        },
                        {
                           title: "Product Management",
                           description: "E2E overview, SLAs management",
                        },
                        {
                           title: "Technology Consulting",
                           description: "Technical questions about languages, architectures and solutions.",
                        },
                        {
                           title: "UX/UI Consulting",
                           description: "User Experience and User Interface consulting.",
                        },
                     ],
                  },
               ],
               whyChooseService: {
                  whyTitle: "Why choosing Gigson Solutions?",
                  whyDescription: "We don't develop just an App or a Web. We build complex and and unique solutions for your business.",
               },
               cases: {
                  heroH1: "Some cases we can do for <span>your business</span>",
                  heroP: "Here you can find some business cases we have worked by diferrent sectors and needs.",
                  tagTitle: "What’s your sector?",
                  needTitle: "What’s your actual need?",
                  resetFilters: "RESET FILTERS",
                  featuresTitle: "Features",
                  solutionTitle: "Solution",
                  toolsTitle: "specifications",
               },
               casesctaacordion: {
                  pcasesctaacordion:
                     "This outline provides you with a solid foundation for developing a detailed case study that you can adapt and expand according to your specific needs.",
                  talk: "Shall we talk?",
               },
               faqsH1: "Questions?<br><span>Let’s go!</span>",
               casesDropdown: [
                  {
                     title: "CRM & ERP Integration",

                     challenge:
                        "Develop a solution that integrates the current Enterprise Resource Planning (ERP) system with a Customer Relationship Management (CRM) system for the architecture and interior design sector. The challenge was to synchronize the management of B2B and B2C accounts with projects at a single point, improving operational efficiency, resource allocation accuracy, and providing a unified view of project conceptualization, design, and execution.",
                     features: [
                        "Unified management of clients and projects between CRM and ERP.",
                        "Integrated dashboard for real-time tracking of project progress, providing client visibility and internal time reporting.",
                        "Automation of invoicing and accounts receivable tracking within the project workflow.",
                        "Coordination of purchases and budgets through the integrated ERP platform.",
                        "Profitability analysis of projects and portfolio management of services.",
                     ],
                     solution:
                        "The integration of HubSpot (CRM) with Asana (project management) and Holded (ERP) provides a complete solution for managing architecture and interior design projects. The solution allowed users to have a comprehensive view of the customer and project lifecycle, from customer acquisition to final project delivery and after-sales service.",
                     tools: [
                        "HubSpot: for advanced customer relationship management and automated marketing.",
                        "Asana: for detailed project planning and task tracking.",
                        "Holded: for efficient management of financial and accounting operations, purchases, and inventory management.",
                        "Custom API integrations to synchronize data between systems.",
                        "Customized dashboards for reporting and performance analysis.",
                        "Enterprise-level data security and GDPR compliance.",
                     ],
                     tags: ["Design agency", "Creative agency", "Building"],
                     need: ["Customer Management", "Project and Task Management"],
                  },
                  {
                     title: "Budget Configurator",

                     challenge:
                        "Develop a system for creating and calculating customized budgets for construction and logistics projects that integrates efficiently with the existing ERP. The goal was to streamline budget creation, allowing for different configurations and increasing data processing speed to improve decision-making, client justifications, and financial planning.",
                     features: [
                        "Creation of dynamic budgets based on project variables such as materials, labor, machinery, and logistics.",
                        "Customizable templates for different types of construction and logistics services.",
                        "Integration of supplier catalogs and real-time pricing.",
                        "Analysis tools to compare budgets and historical costs.",
                        "Scenario simulation to evaluate the impact of different variables on the final budget.",
                     ],
                     solution:
                        "The integration of the budget configurator based on a WebApp and integrated with Odoo provides a flexible and powerful platform for the financial management of construction and logistics projects. By connecting with the existing ERP, this solution allows for the creation, validation, and external export of budgets to communicate project finances to Odoo.",
                     tools: [
                        "Odoo: for detailed budget management and configuration, leveraging its flexibility and customizable modules.",
                        "AWS: for cloud computing infrastructure, ensuring scalability, security, and high availability.",
                        "Business Intelligence modules for data visualization and decision-making based on advanced analytics.",
                        "APIs for integrating data from external suppliers and real-time price updates.",
                        "Compliance with international security standards and data notice policies.",
                     ],
                     tags: ["Design agency", "Creative agency", "Building", "Logistics"],
                     need: ["Improve service profitability", "Data centralization"],
                  },
                  {
                     title: "End2End Tool Integration for eCommerce",

                     challenge:
                        "Create and develop an API Orchestrator that integrates ERP, CMS, different marketplaces, and Third-Party Logistics (3PL) providers for the Dropshipping and Logistics industry. The goal is to improve operational efficiency and customer experience by simplifying the management of purchases, sales, and logistics.",
                     features: [
                        "Single interface to manage operations across different eCommerce platforms and marketplaces.",
                        "ERP integration for efficient resource and inventory management.",
                        "Connection with 3PLs to optimize the shipping and delivery process.",
                        "Advanced analytical tools through Google Looker for data-driven decision-making.",
                        "Real-time synchronization of orders and stock between marketplaces and the management system.",
                     ],
                     solution:
                        "Implementing a unified API Orchestrator that connects Odoo (ERP), Prestashop (CMS), Huboo (3PL), and Amazon Selling Central provides a comprehensive view of the eCommerce process. This solution facilitates automation and synchronization between platforms, ensuring smooth and transparent end-to-end management.",
                     tools: [
                        "Odoo as the ERP system for centralized business administration.",
                        "Prestashop for content management and online store management.",
                        "Huboo as the logistics and shipping management system.",
                        "Amazon Selling Central for integration with the Amazon marketplace.",
                        "Google Looker for data analysis and advanced reporting.",
                     ],
                     tags: ["Logistics", "Manufacturing", "eCommerce"],
                     need: ["Improve security", "Avoid human errors", "Centralize information"],
                  },
                  {
                     title: "Integrated Platform for Creative Agencies",

                     challenge:
                        "Implement a solution that integrates project management tools, CRM, and task management for creative agencies. The aim is to improve campaign planning, creative resource management, and client communication.",
                     features: [
                        "Centralized management of projects and clients.",
                        "CRM integration for tracking clients and business opportunities.",
                        "Task management and collaboration tools for creative teams.",
                        "Real-time visualization of project progress and resource allocation.",
                        "Performance analysis of campaigns and projects.",
                     ],
                     solution:
                        "The integration of tools such as Adobe Creative Cloud (content creation), Trello (task management), Slack (communication and collaboration), and Salesforce (CRM) provides a robust platform for campaign and project management. This solution allows for better planning, tracking, and analysis of creative activities, ensuring smooth communication with clients.",
                     tools: [
                        "Adobe Creative Cloud: For creating and editing creative content, including graphic design, video, and other digital media.",
                        "Trello: For task and project management, allowing for visual organization and tracking of task progress.",
                        "Slack: For real-time communication and collaboration among team members, facilitating coordination and idea exchange.",
                        "Salesforce: For customer relationship management, tracking of business opportunities, and marketing automation.",
                        "Zapier: For the integration and automation of workflows between different tools, ensuring efficient data synchronization.",
                        "Google Analytics: For data analysis and evaluation of campaign and creative project performance.",
                     ],
                     tags: ["Design Studio", "Creative Agency", "eCommerce"],
                     need: ["Customer Management", "Project and Task Management", "Centralize information"],
                  },
               ],
               faqsDropdown: [
                  { title: "Digital product" },
                  {
                     question: "What is a custom digital product?",
                     answer:
                        "A digital product meets the needs of users, business objectives, and market opportunities to provide the best solution to the customer. It differs from standard solutions in that it adapts to the specific processes and tools of the client, offering greater flexibility and efficiency.",
                  },
                  {
                     question: "How do you ensure you understand what I need?",
                     answer:
                        "Our process begins with discovery and analysis meetings where we delve into use cases to ensure we understand all the needs before starting development.",
                  },
                  {
                     question: "Why choose a custom software solution instead of a standard one?",
                     answer:
                        'Standard solutions are often generic for any type of business, usually include unnecessary functions that complicate their use, and are not easily "integrated" with other solutions that may already be integrated. A custom solution is designed to integrate perfectly with your way of working, improving productivity and efficiency.',
                  },
                  {
                     question: "Will I have support and maintenance when development is finished?",
                     answer:
                        "Of course! If you want us to take care of maintenance and support, we will do so as we have a dedicated team for it where we will be delighted to solve any problems that may arise.",
                  },
                  { title: "Ownership" },
                  {
                     question: "Who will develop my solution?",
                     answer:
                        "At Gigson Solutions, we have different collaborators specialized in each part of the process to provide a complete service adapted to the needs of the client such as software development, usability, marketing, and graphic, legal, etc.",
                  },
                  {
                     question: "Will I own my solution?",
                     answer: "If you want, you can be the sole owner of the product we develop to gain a competitive advantage.",
                  },
                  { title: "Product Development" },
                  {
                     question: "What is the difference between Gigson Solutions and hiring a developer?",
                     answer:
                        "The main difference is that a developer will implement what you think, define, and prioritize. It is rare for them to ask aspects like whether it is really what the business needs, the pricing model, or the security of the information.",
                  },
                  {
                     question: "How is security and privacy handled in new products?",
                     answer:
                        "Security and privacy are a priority in all our solutions. We adopt secure coding practices and can certify the products we develop following standards like GDPR, SOC2, or HIPAA.",
                  },
                  {
                     question: "Can I coordinate the product development myself?",
                     answer:
                        "Yes, however, we do not recommend it as a lack of experience in managing technical teams can lead to communication misunderstandings, poor risk management, and resource management.",
                  },
                  {
                     question: "Have we left anything unanswered?",
                     answer:
                        "We'll be happy to address any other questions you may have. You can reach out to us at info@gigsonsolutions.com or through our contact form.",
                     cta: "Shall we talk?",
                  },
               ],
               form: {
                  title: "Ready to help you",
                  name: {
                     label: "My name is",
                     placeholder: "Name and lastname",
                  },
                  service: {
                     label: "and I'm interested in",
                     placeholder: "Service",
                     services: ["Software engineering services", "Cibersecurity services", "Consulting services"],
                  },
                  budget: {
                     label: "The budget for my idea is",
                     placeholder: "no idea",
                  },
                  email: {
                     label: "My email is",
                     placeholder: "name@example.com",
                  },
                  details: {
                     label: "A short project description",
                     placeholder: "Project details (optional)",
                  },
                  checkbox: {
                     first: "I have read the ",
                     second: "legal disclaimer",
                     third: " and agree to the processing of my personal data.",
                  },
                  send: "SEND",
               },
               notFound: {
                  title: "<span>Oops... </span>",
                  title2: "It looks like we've gotten lost.",
                  cta: "GO BACK TO HOME.",
                  description: "The page you are looking for seems to no longer be available.",
                  banner404: "error 404",
               },
               policity: {
                  h2_1: "Data Protection Policy",
                  h3_1: "1. PURPOSE AND ACCEPTANCE",
                  pc_1_1:
                     "This legal notice regulates the use of the website www.somosgigson.com (hereinafter, THE WEBSITE), which is owned by Gigson (hereinafter, THE WEBSITE OWNER).",
                  pc_1_2:
                     "Browsing the website of THE WEBSITE OWNER attributes the condition of a user of the same and implies full and unreserved acceptance of each and every one of the provisions included in this Legal Notice, which may be subject to modifications.",
                  pc_1_3:
                     "The user agrees to make proper use of the website in accordance with the laws, good faith, public order, traffic uses, and this Legal Notice. The user will be liable to THE WEBSITE OWNER or to third parties for any damages that may be caused as a result of the breach of this obligation.",
                  h3_2: "2. IDENTIFICATION AND COMMUNICATIONS",
                  pc_2_1:
                     "THE WEBSITE OWNER, in compliance with Law 34/2002, of July 11, on information society services and electronic commerce, informs you that:",
                  pc_2_2: "Its company name is: Awesomely OÜ",
                  pc_2_3: "VAT Number: EE102613528",
                  pc_2_4: "Its registered office is at: Lootsa Tn 2a Harju, 11415, Tallinn, Estonia",
                  pc_2_5: "To communicate with us, we provide various means of contact as detailed below:",
                  pc_2_6: "Phone: +34630840225",
                  pc_2_7: "Email: hello@awesomelygroup.com",
                  pc_2_8:
                     "All notifications and communications between users and THE WEBSITE OWNER will be considered effective, for all purposes, when made via postal mail or any other means detailed above.",
                  h3_3: "3. CONDITIONS OF ACCESS AND USE",
                  pc_3_1:
                     "The website and its services are freely accessible, however, THE WEBSITE OWNER conditions the use of some of the services offered on its website to the prior completion of the corresponding form.",
                  pc_3_2:
                     "The user guarantees the authenticity and currency of all data communicated to THE WEBSITE OWNER and will be solely responsible for any false or inaccurate statements made.",
                  pc_3_3:
                     "The user expressly agrees to make appropriate use of the contents and services of THE WEBSITE OWNER and not to use them for, among others:",
                  ps_3_1:
                     "1. Disseminating criminal, violent, pornographic, racist, xenophobic, offensive content, content advocating terrorism or, in general, content contrary to the law or public order.",
                  ps_3_2:
                     "2. Introducing computer viruses or performing actions capable of altering, damaging, interrupting, or generating errors or damage to the electronic documents, data, or physical and logical systems of THE WEBSITE OWNER or third parties; as well as hindering the access of other users to the website and its services through the massive consumption of the computer resources through which THE WEBSITE OWNER provides its services.",
                  ps_3_3:
                     "3. Attempting to access the email accounts of other users or restricted areas of the computer systems of THE WEBSITE OWNER or third parties and, where appropriate, extracting information.",
                  ps_3_4:
                     "4. Violating intellectual or industrial property rights, as well as violating the confidentiality of the information of THE WEBSITE OWNER or third parties.",
                  ps_3_5: "5. Impersonating another user, public administrations, or a third party.",
                  ps_3_6:
                     "6. Reproducing, copying, distributing, making available, or any other form of public communication, transforming, or modifying the contents, unless authorized by the holder of the corresponding rights or it is legally permitted.",
                  ps_3_7:
                     "7. Collecting data for advertising purposes and sending any kind of advertising and communications for sales or other commercial purposes without prior request or consent.",
                  pc_3_4:
                     "All the content of the website, such as texts, photographs, graphics, images, icons, technology, software, as well as its graphic design and source codes, constitute a work whose ownership belongs to THE WEBSITE OWNER, without any of the exploitation rights over them being understood to be transferred to the user beyond what is strictly necessary for the correct use of the web.",
                  pc_3_5:
                     "Ultimately, users who access this website can view the content and make, where appropriate, private authorized copies provided that the reproduced elements are not subsequently transferred to third parties, installed on servers connected to networks, or subjected to any kind of exploitation.",
                  pc_3_6:
                     "Likewise, all trademarks, trade names, or distinctive signs of any kind that appear on the website are the property of THE WEBSITE OWNER, without it being understood that the use or access to the same attributes any right to the user over them.",
                  pc_3_7:
                     "The distribution, modification, assignment, or public communication of the content and any other act that has not been expressly authorized by the holder of the exploitation rights is prohibited.",
                  pc_3_8:
                     "The establishment of a hyperlink does not imply in any case the existence of relations between THE WEBSITE OWNER and the owner of the website where it is established, nor the acceptance and approval by THE WEBSITE OWNER of its content or services. Those who intend to establish a hyperlink must previously request written authorization from THE WEBSITE OWNER.",
                  pc_3_9:
                     "In any case, the hyperlink will only allow access to the homepage or the start page of our website, and must refrain from making false, inaccurate, or incorrect statements or indications about THE WEBSITE OWNER, or include illegal content, contrary to good customs, and public order.",
                  pc_3_10:
                     "THE WEBSITE OWNER is not responsible for the use that each user gives to the materials made available on this website or for the actions taken based on them.",
                  h3_4: "4. PRIVACY POLICY",
                  pc_4_1: "Who is responsible for processing your data:",
                  pc_4_2: "The data controller is identified in point 1 of this Legal Notice.",
                  pc_4_3: "What type of data we have about you and how we have obtained it",
                  pc_4_4: "The categories of personal data we process for clients and suppliers are:",
                  ps_4_1: "1. Identification data",
                  ps_4_2: "2. Postal or electronic addresses",
                  ps_4_3: "3. Commercial information",
                  ps_4_4: "4. Economic and transaction data",
                  pc_4_5: "In no case do we process specially protected data:",
                  pc_4_6:
                     "All the data mentioned above has been obtained either directly from you through the submission of a commercial offer, contractual proposal, etc., or from your company by providing us with the identification data and other information necessary to carry out the object of the contractual relationship between the parties. It will be your or your company’s obligation to provide us with updated data in case of modification.",
               },
               notice: {
                  h2_1: "Data Protection Policy",
                  h3_1: "1. PURPOSE AND ACCEPTANCE",
                  pc_1_1:
                     "This legal notice regulates the use of the website www.somosgigson.com (hereinafter, THE WEBSITE), which is owned by Gigson (hereinafter, THE WEBSITE OWNER).",
                  pc_1_2:
                     "Browsing the website of THE WEBSITE OWNER attributes the condition of a user of the same and implies full and unreserved acceptance of each and every one of the provisions included in this Legal Notice, which may be subject to modifications.",
                  pc_1_3:
                     "The user agrees to make proper use of the website in accordance with the laws, good faith, public order, traffic uses, and this Legal Notice. The user will be liable to THE WEBSITE OWNER or to third parties for any damages that may be caused as a result of the breach of this obligation.",
                  h3_2: "2. IDENTIFICATION AND COMMUNICATIONS",
                  pc_2_1:
                     "THE WEBSITE OWNER, in compliance with Law 34/2002, of July 11, on information society services and electronic commerce, informs you that:",
                  pc_2_2: "Its company name is: Awesomely OÜ",
                  pc_2_3: "VAT Number: EE102613528",
                  pc_2_4: "Its registered office is at: Lootsa Tn 2a Harju, 11415, Tallinn, Estonia",
                  pc_2_5: "To communicate with us, we provide various means of contact as detailed below:",
                  pc_2_6: "Phone: +34630840225",
                  pc_2_7: "Email: hello@awesomelygroup.com",
                  pc_2_8:
                     "All notifications and communications between users and THE WEBSITE OWNER will be considered effective, for all purposes, when made via postal mail or any other means detailed above.",
                  h3_3: "3. CONDITIONS OF ACCESS AND USE",
                  pc_3_1:
                     "The website and its services are freely accessible, however, THE WEBSITE OWNER conditions the use of some of the services offered on its website to the prior completion of the corresponding form.",
                  pc_3_2:
                     "The user guarantees the authenticity and currency of all data communicated to THE WEBSITE OWNER and will be solely responsible for any false or inaccurate statements made.",
                  pc_3_3:
                     "The user expressly agrees to make appropriate use of the contents and services of THE WEBSITE OWNER and not to use them for, among others:",
                  ps_3_1:
                     "1. Disseminating criminal, violent, pornographic, racist, xenophobic, offensive content, content advocating terrorism or, in general, content contrary to the law or public order.",
                  ps_3_2:
                     "2. Introducing computer viruses or performing actions capable of altering, damaging, interrupting, or generating errors or damage to the electronic documents, data, or physical and logical systems of THE WEBSITE OWNER or third parties; as well as hindering the access of other users to the website and its services through the massive consumption of the computer resources through which THE WEBSITE OWNER provides its services.",
                  ps_3_3:
                     "3. Attempting to access the email accounts of other users or restricted areas of the computer systems of THE WEBSITE OWNER or third parties and, where appropriate, extracting information.",
                  ps_3_4:
                     "4. Violating intellectual or industrial property rights, as well as violating the confidentiality of the information of THE WEBSITE OWNER or third parties.",
                  ps_3_5: "5. Impersonating another user, public administrations, or a third party.",
                  ps_3_6:
                     "6. Reproducing, copying, distributing, making available, or any other form of public communication, transforming, or modifying the contents, unless authorized by the holder of the corresponding rights or it is legally permitted.",
                  ps_3_7:
                     "7. Collecting data for advertising purposes and sending any kind of advertising and communications for sales or other commercial purposes without prior request or consent.",
                  pc_3_4:
                     "All the content of the website, such as texts, photographs, graphics, images, icons, technology, software, as well as its graphic design and source codes, constitute a work whose ownership belongs to THE WEBSITE OWNER, without any of the exploitation rights over them being understood to be transferred to the user beyond what is strictly necessary for the correct use of the web.",
                  pc_3_5:
                     "Ultimately, users who access this website can view the content and make, where appropriate, private authorized copies provided that the reproduced elements are not subsequently transferred to third parties, installed on servers connected to networks, or subjected to any kind of exploitation.",
                  pc_3_6:
                     "Likewise, all trademarks, trade names, or distinctive signs of any kind that appear on the website are the property of THE WEBSITE OWNER, without it being understood that the use or access to the same attributes any right to the user over them.",
                  pc_3_7:
                     "The distribution, modification, assignment, or public communication of the content and any other act that has not been expressly authorized by the holder of the exploitation rights is prohibited.",
                  pc_3_8:
                     "The establishment of a hyperlink does not imply in any case the existence of relations between THE WEBSITE OWNER and the owner of the website where it is established, nor the acceptance and approval by THE WEBSITE OWNER of its content or services. Those who intend to establish a hyperlink must previously request written authorization from THE WEBSITE OWNER.",
                  pc_3_9:
                     "In any case, the hyperlink will only allow access to the homepage or the start page of our website, and must refrain from making false, inaccurate, or incorrect statements or indications about THE WEBSITE OWNER, or include illegal content, contrary to good customs, and public order.",
                  pc_3_10:
                     "THE WEBSITE OWNER is not responsible for the use that each user gives to the materials made available on this website or for the actions taken based on them.",
                  h3_4: "4. PRIVACY POLICY",
                  pc_4_1: "Who is responsible for processing your data:",
                  pc_4_2: "The data controller is identified in point 1 of this Legal Notice.",
                  pc_4_3: "What type of data we have about you and how we have obtained it",
                  pc_4_4: "The categories of personal data we process for clients and suppliers are:",
                  ps_4_1: "1. Identification data",
                  ps_4_2: "2. Postal or electronic addresses",
                  ps_4_3: "3. Commercial information",
                  ps_4_4: "4. Economic and transaction data",
                  pc_4_5: "In no case do we process specially protected data:",
                  pc_4_6:
                     "All the data mentioned above has been obtained either directly from you through the submission of a commercial offer, contractual proposal, etc., or from your company by providing us with the identification data and other information necessary to carry out the object of the contractual relationship between the parties. It will be your or your company’s obligation to provide us with updated data in case of modification.",
               },
               cookies: {
                  h2_1: "Política de protección de datos",
                  h3_1: "1. OBJETO Y ACEPTACIÓN",
                  pc_1_1:
                     "El presente aviso legal regula el uso del sitio web www.somosgigson.com (en adelante, LA WEB), del que es titular Gigson (en adelante, EL PROPIETARIO DE LA WEB).",
                  pc_1_2:
                     "La navegación por el sitio web de EL PROPIETARIO DE LA WEB atribuye la condición de usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal, que pueden sufrir modificaciones.",
                  pc_1_3:
                     "El usuario se obliga a hacer un uso correcto del sitio web de conformidad con las leyes, la buena fe, el orden público, los usos del tráfico y el presente Aviso Legal. El usuario responderá frente a EL PROPIETARIO DE LA WEB o frente a terceros, de cualesquiera daños y perjuicios que pudieran causarse como consecuencia del incumplimiento de dicha obligación.",
                  h3_2: "2. IDENTIFICACIÓN Y COMUNICACIONES",
                  pc_2_1:
                     "EL PROPIETARIO DE LA WEB, en cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, le informa que:",
                  pc_2_2: "Su denominación social es: Awesomely OÜ",
                  pc_2_3: "Número de VAT: EE102613528",
                  pc_2_4: "Su domicilio social está en: Lootsa Tn 2a Harju, 11415, Tallinn, Estonia",
                  pc_2_5: "Para comunicarse con nosotros, ponemos a su disposición diferentes medios de contacto que detallamos a continuación:",
                  pc_2_6: "Teléfono: +34630840225",
                  pc_2_7: "Email: hello@awesomelygroup.com",
                  pc_2_8:
                     "Todas las notificaciones y comunicaciones entre los usuarios y EL PROPIETARIO DE LA WEB se considerarán eficaces, a todos los efectos, cuando se realicen a través de correo postal o cualquier otro medio de los detallados anteriormente.",
                  h3_3: "3. CONDICIONES DE ACCESO Y UTILIZACIÓN",
                  pc_3_1:
                     "El sitio web y sus servicios son de acceso libre y gratuito, no obstante, EL PROPIETARIO DE LA WEB condiciona la utilización de algunos de los servicios ofrecidos en su web a la previa cumplimentación del correspondiente formulario.",
                  pc_3_2:
                     "El usuario garantiza la autenticidad y actualidad de todos aquellos datos que comunique a EL PROPIETARIO DE LA WEB y será el único responsable de las manifestaciones falsas o inexactas que realice.",
                  pc_3_3:
                     "El usuario se compromete expresamente a hacer un uso adecuado de los contenidos y servicios de EL PROPIETARIO DE LA WEB y a no emplearlos para, entre otros:",
                  ps_3_1:
                     "1. Difundir contenidos delictivos, violentos, pornográficos, racistas, xenófobo, ofensivos, de apología del terrorismo o, en general, contrarios a la ley o al orden público.",
                  ps_3_2:
                     "2. Introducir en la red virus informáticos o realizar actuaciones susceptibles de alterar, estropear, interrumpir o generar errores o daños en los documentos electrónicos, datos o sistemas físicos y lógicos de EL PROPIETARIO DE LA WEB o de terceras personas; así como obstaculizar el acceso de otros usuarios al sitio web y a sus servicios mediante el consumo masivo de los recursos informáticos a través de los cuales EL PROPIETARIO DE LA WEB presta sus servicios.",
                  ps_3_3:
                     "3. Intentar acceder a las cuentas de correo electrónico de otros usuarios o a áreas restringidas de los sistemas informáticos de EL PROPIETARIO DE LA WEB o de terceros y, en su caso, extraer información.",
                  ps_3_4:
                     "4. Vulnerar los derechos de propiedad intelectual o industrial, así como violar la confidencialidad de la información de EL PROPIETARIO DE LA WEB o de terceros.",
                  ps_3_5: "5. Suplantar la identidad de otro usuario, de las administraciones públicas o de un tercero.",
                  ps_3_6:
                     "6. Reproducir, copiar, distribuir, poner a disposición de, o cualquier otra forma de comunicación pública, transformar o modificar los contenidos, a menos que se cuente con la autorización del titular de los correspondientes derechos o ello resulte legalmente permitido.",
                  ps_3_7:
                     "7. Recabar datos con finalidad publicitaria y de remitir publicidad de cualquier clase y comunicaciones con fines de venta u otras de naturaleza comercial sin que medie su previa solicitud o consentimiento.",
                  pc_3_4:
                     "Todos los contenidos del sitio web, como textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a EL PROPIETARIO DE LA WEB, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.",
                  pc_3_5:
                     "En definitiva, los usuarios que accedan a este sitio web pueden visualizar los contenidos y efectuar, en su caso, copias privadas autorizadas siempre que los elementos reproducidos no sean cedidos posteriormente a terceros, ni se instalen a servidores conectados a redes, ni sean objeto de ningún tipo de explotación.",
                  pc_3_6:
                     "Asimismo, todas las marcas, nombres comerciales o signos distintivos de cualquier clase que aparecen en el sitio web son propiedad de EL PROPIETARIO DE LA WEB, sin que pueda entenderse que el uso o acceso al mismo atribuya al usuario derecho alguno sobre los mismos.",
                  pc_3_7:
                     "La distribución, modificación, cesión o comunicación pública de los contenidos y cualquier otro acto que no haya sido expresamente autorizado por el titular de los derechos de explotación quedan prohibidos.",
                  pc_3_8:
                     "El establecimiento de un hiperenlace no implica en ningún caso la existencia de relaciones entre EL PROPIETARIO DE LA WEB y el propietario del sitio web en la que se establezca, ni la aceptación y aprobación por parte de EL PROPIETARIO DE LA WEB de sus contenidos o servicios. Aquellas personas que se propongan establecer un hiperenlace previamente deberán solicitar autorización por escrito a EL PROPIETARIO DE LA WEB.",
                  pc_3_9:
                     "En todo caso, el hiperenlace únicamente permitirá el acceso a la home-page o página de inicio de nuestro sitio web, asimismo deberá abstenerse de realizar manifestaciones o indicaciones falsas, inexactas o incorrectas sobre EL PROPIETARIO DE LA WEB, o incluir contenidos ilícitos, contrarios a las buenas costumbres y al orden público.",
                  pc_3_10:
                     "EL PROPIETARIO DE LA WEB no se responsabiliza del uso que cada usuario le dé a los materiales puestos a disposición en este sitio web ni de las actuaciones que realice en base a los mismos.",
                  h3_4: "4. POLÍTICA DE PRIVACIDAD",
                  pc_4_1: "Quién es el Responsable de tratamiento de sus datos:",
                  pc_4_2: "El responsable de tratamiento se encuentra identificado en el expositivo 1 de este Aviso Legal.",
                  pc_4_3: "Qué tipo de datos tenemos sobre su persona y cómo los hemos obtenido",
                  pc_4_4: "Las categorías de datos personales que tratamos de clientes y proveedores son:",
                  ps_4_1: "1. Datos de identificación",
                  ps_4_2: "2. Direcciones postales o electrónicas",
                  ps_4_3: "3. Información comercial",
                  ps_4_4: "4. Datos económicos y de transacciones",
                  pc_4_5: "En ningún caso tratamos datos especialmente protegidos:",
                  pc_4_6:
                     "Todos los datos arriba mencionados los hemos obtenido o directamente de Usted mediante la presentación de una oferta comercial, propuesta contractual, etc. o mediante su empresa al facilitarnos los datos de identificación y demás información necesaria para llevar al cabo el objeto de la relación contractual entre las partes. Será una obligación suya o de su empresa facilitarnos los datos actualizados en caso de modificación.",
               },
               cookiesBanner: {
                  h2: "WE ALSO HAVE COOKIES",
                  p: "We use our own and third-party cookies to analyze our services and show you advertising related to your preferences based on a profile created from your browsing habits (for example, pages visited). You can accept or reject them in the following buttons.",
                  btnAccept: "ACCEPT",
                  btnDenie: "DECLINE",
               },
            },
         },
         es: {
            translation: {
               menu: {
                  about: "NOSOTROS",
                  services: "SERVICIOS",
                  cases: "CASOS",
                  faqs: "FAQs",
                  contact: "CONTÁCTANOS",
                  legal: "Política legal",
                  cookies: "Política de cookies",
                  notice: "Aviso legal",
               },
               home: {
                  heroH1: "Tecnología para <span>impulsar</span> tu negocio<span>.</span>",
                  heroP: "SOLUCIONES A MEDIDA PARA NEGOCIOS COMPLEJOS",
                  heroBtn: "CONTÁCTANOS",
                  heroScroll: "SEGUIR EXPLORANDO",
                  servicesTitle: "Productos <span>a medida</span> para cualquier negocio ·",
                  servicesP: {
                     p1: "Nos dedicamos a aprovechar al máximo las herramientas de software que ya utilizas, conectándolas entre sí, optimizándolas para que rindan más y alineándolas con las necesidades reales de tu negocio.",
                     p2: "Y si lo que necesitas aún no existe... lo creamos para ti.",
                  },
                  servicesBtn: "NUESTROS SERVICIOS",
               },
               ctas: {
                  contact: "CONTÁCTANOS",
                  talk: "¿HABLAMOS?",
               },
               caseswhygigson: {
                  wth2: "¿Qué puede hacer Gigson Solutions por tu negocio?",
                  wp1: "En Gigson Solutions, creemos que la tecnología debería impulsar tu negocio hacia adelante, no limitarlo.",
                  wp2: "Aquí hay algunos ejemplos de lo que podemos hacer por ti.",
                  wlink: "VER CASOS",
               },
               whyservices: {
                  sth2: "Simplificando un mundo innecesariamente complejo.",
                  slink: "VER SERVICIOS",
               },
               about: {
                  title: "Somos un equipo de profesionales expertos con más de <span>9 años</span> de experiencia.",
                  description:
                     "Contamos con todos los perfiles necesarios para el desarrollo de un producto digital, y con diferentes partners en ámbitos específicos para complementar las solución all-in-one.",
                  cta: "HABLEMOS",
                  titleH2: "Descubre lo que nos mueve",
                  belive: {
                     t1: "Calidad",
                     t2: "Compromiso",
                     t3: "Facilidad",
                     p1: "Independientemente de si estamos desarrollando una prueba de concepto o un producto final, implementaremos diferentes estándares de calidad de producto y de gestión de proyectos para asegurarnos de que cada producto cumpla y supere las expectativas.",
                     p2: "Podrás elegir el tipo de compromiso que quieras tener con nosotros. Estaremos siempre a tu lado para acompañarte en cualquier fase, no obstante si no quieres continuar, nos encargaremos del cierre y del traspaso necesario cumpliendo con toda legalidad vigente.",
                     p3: "Sabemos que hablar con un desarrollador no es fácil. Con nosotros hablaras con un consultor de negocios con conocimiento técnico para entender tus necesidades y validar su viabilidad técnica a la vez.",
                  },
                  need: {
                     t: "¿Qué necesito para hacer un <span>producto digital</span>?",
                     d: "Pensar que el desarrollo de un producto digital es un proyecto común y corriente representa un riesgo considerable. Este tipo de producto, requiere una atención detallada en cada aspecto, gestionada por profesionales especializados.",
                     specialist1: "DIRECTOR DE ORQUESTA",
                     specialist2: "PICACÓDIGO PARA TODO",
                     specialist3: "LÍDER TÉCNICO",
                     specialist4: "PICACÓDIGO OCULTO",
                     specialist5: "ESTRATEGA",
                     specialist6: "PICACÓDIGO A LA VISTA",
                     specialist7: "VALIDACIÓN",
                     specialist8: "DISEÑADOR DEL USO",
                     specialist9: "PROTEGE EL PRODUCTO",
                     label: "*No todos estos roles son necesarios en todos los productos. Dependiendo de tus necesidades, puede que los roles sean diferente.",
                     cta2: "CONTÁCTANOS",
                  },
               },
               service: {
                  serviceH1: "Descubre todos <span>nuestros servicios</span>",
                  serviceP: "SOLUCIONES A MEDIDA PARA NEGOCIOS COMPLEJOS",
               },
               serviceCard: [
                  {
                     title: "Servicios de ciberseguridad",
                     description:
                        "La seguridad de la información ya no está en la hoja de ruta. La ciberseguridad es una NECESIDAD en todos los negocios y todas las empresas deben tener el conocimiento, las herramientas y los procesos para evitar o minimizar los ataques.",
                     cards: [
                        {
                           title: "Evaluación de Seguridad",
                           description: "Análisis de vulnerabilidades, Informe de remediación, Evaluaciones de seguridad de aplicaciones.",
                        },
                        {
                           title: "Capacitación",
                           description: "Capacitación sobre phishing y seguridad de la información.",
                        },
                        {
                           title: "Transformaciones de Seguridad",
                           description: "Evaluaciones del estado actual y futuro, transformación de TI.",
                        },
                     ],
                  },
                  {
                     title: "Servicios de ingeniería de software",
                     description:
                        "Desde integrar diferentes herramientas, desarrollar nuevas características y productos hasta monitorear y mantener un producto, nuestro equipo está listo para ello. Nuestro equipo de ingeniería de software está compuesto por desarrolladores, arquitectos y testers para construir cualquier necesidad con las mejores tecnologías de vanguardia.",
                     cards: [
                        {
                           title: "Proveedor de Nube",
                           description: "AWS, Microsoft Azure, GCP.",
                        },
                        {
                           title: "Contenedores y Orquestación",
                           description: "Docker, K8s, WPAR y otros.",
                        },
                        {
                           title: "CI/CD",
                           description: "Jenkins, GitLab, GitHub, Git.",
                        },
                        {
                           title: "Base de Datos",
                           description: "Oracle, MySQL, Mango DB, PostgresSQL, MS SQL y otros.",
                        },
                        {
                           title: "Mensajería y Data Streaming",
                           description: "RabbitMQ, Apache Kafka, Apache, Redis, ELK stack y otros.",
                        },
                        {
                           title: "Monitoreo",
                           description: "Prometheus, Datalog, Grafana, Azure monitor, Amazon CloudWatch, Zabbix y otros.",
                        },
                     ],
                  },
                  {
                     title: "Servicios de consultoría",
                     description:
                        "Nuestro equipo de ingenieros de software, arquitectos y desarrolladores experimentados utiliza las mejores tecnologías adaptadas a tu industria. Gigson solutions es tu socio de confianza en el desarrollo de software. Entendemos que detrás de cada línea de código hay una oportunidad para obtener una ventaja competitiva.",
                     cards: [
                        {
                           title: "CTO como Servicio",
                           description: "Liderazgo técnico y de negocio para las áreas de ingeniería y producto.",
                        },
                        {
                           title: "Gestión de Proyectos",
                           description: "Ejecución de proyectos, Análisis de riesgos, Gestión de proveedores.",
                        },
                        {
                           title: "Gestión de Productos",
                           description: "Visión general de E2E, Gestión de SLAs.",
                        },
                        {
                           title: "Consultoría Tecnológica",
                           description: "Consultas técnicas sobre lenguajes, arquitecturas y soluciones.",
                        },
                        {
                           title: "Consultoría UX/UI",
                           description: "Consultoría de experiencia de usuario e interfaz de usuario.",
                        },
                     ],
                  },
               ],
               whyChooseService: {
                  whyTitle: "¿Por qué elegir gigson solutions?",
                  whyDescription: "En gigson solutions pensamos que la tecnología debería impulsar tu negocio, no limitarlo.",
               },
               cases: {
                  heroH1: "¿Cómo podemos ayudarte a alcanzar tus objetivos?",
                  heroP: "Contesta las siguientes preguntas y observa las mejores soluciones para tu sector.",
                  tagTitle: "¿Cuál es tu sector?",
                  needTitle: "¿Cuál es tu necesidad actual?",
                  resetFilters: "BORRAR FILTROS",
                  featuresTitle: "Funcionalidades",
                  solutionTitle: "Solución",
                  toolsTitle: "Especificaciones",
               },
               casesctaacordion: {
                  pcasesctaacordion:
                     "Este esquema te proporciona una base sólida para desarrollar un caso de estudio detallado que puedes adaptar y expandir según tus necesidades específicas.",
                  talk: "¿HABLAMOS?",
               },
               faqsH1: "¿Preguntas?<br><span>Las resolvemos</span>",
               casesDropdown: [
                  {
                     title: "Integración CRM & ERP",

                     challenge:
                        "Desarrollar una solución que integre el actual sistema de planificación de recursos empresariales (ERP) con un sistema de gestión de las relaciones con el cliente (CRM) para el sector de arquitectura e interiorismo. El reto consistió en sincronizar la gestión de cuentas B2B y B2C con los proyectos en un solo punto, mejorando la eficiencia operativa, la exactitud en la asignación de recursos y proporcionando una visión unificada de la conceptualización, diseño y ejecución de los proyectos.",
                     features: [
                        "Gestión unificada de clientes y proyectos entre CRM y ERP.",
                        "Panel de control integrado para seguimiento en tiempo real del progreso de los proyectos dando visibilidad al cliente y reporte horario interno.",
                        "Automatización de facturación y seguimiento de cuentas por cobrar dentro del flujo de trabajo de proyectos.",
                        "Coordinación de compras y presupuestos a través de la plataforma de ERP integrada.",
                        "Análisis de rentabilidad de proyectos y gestión de cartera de servicios.",
                     ],
                     solution:
                        "Solución La integración de HubSpot (CRM) con Asana (gestión de proyectos) y Holded (ERP) proporciona una solución completa para la gestión de proyectos de arquitectura e interiorismo. La solución permitió a los usuarios tener una visión completa del ciclo de vida del cliente y los proyectos, desde la adquisición del cliente hasta la entrega final del proyecto y posventa.",
                     tools: [
                        "HubSpot: para la gestión avanzada de relaciones con clientes y marketing automatizado.",
                        "Asana: para la planificación detallada de proyectos y seguimiento de tareas.",
                        "Holded: para el manejo eficiente de operaciones financieras y contables, compras y gestión de inventarios.",
                        "Integraciones API personalizadas para sincronizar datos entre sistemas.",
                        "Dashboards personalizados para reportes y análisis de desempeño.",
                        "Seguridad de datos de nivel empresarial y cumplimiento de GDPR.",
                     ],
                     tags: ["Estudio diseño", "Agencia creativa", "Construcción"],
                     need: ["Gestión de clientes", "Gestión de proyectos y tareas"],
                  },
                  {
                     title: "Configurador de Presupuestos",

                     challenge:
                        "Elaborar un sistema de creación y cálculo de presupuestos personalizados para proyectos de construcción y logística, que se integre de manera eficiente con el ERP existente. El objetivo era agilizar la creación de presupuestos, permitiendo diferentes configuraciones y aumentando el tiempo de procesado de la información con el fin de mejorar la toma de decisiones, justificaciones a cliente y la planificación financiera.",
                     features: [
                        "Creación de presupuestos dinámicos basados en variables de proyecto como materiales, mano de obra, maquinaria y logística.",
                        "Plantillas personalizables para diferentes tipos de construcciones y servicios logísticos.",
                        "Integración de catálogos de proveedores y precios en tiempo real.",
                        "Herramientas de análisis para comparar presupuestos y costos históricos.",
                        "Simulación de escenarios para evaluar el impacto de diferentes variables en el presupuesto final.",
                     ],
                     solution:
                        "La integración del configurador de presupuestos basado en una WebApp e integrado Odoo proporciona una plataforma ágil y potente para la gestión financiera de proyectos de construcción y logística. Conectando con el ERP existente, esta solución permite crear, validar y exportar los presupuestos externamente para comunicar las finanzas de los proyectos a Odoo.",
                     tools: [
                        "Odoo: para la gestión y configuración detallada de presupuestos, aprovechando su flexibilidad y módulos personalizables.",
                        "AWS: para la infraestructura de computación en la nube, garantizando escalabilidad, seguridad y alta disponibilidad.",
                        "Módulos de Inteligencia de Negocio para la visualización de datos y toma de decisiones basada en análisis avanzados.",
                        "APIs para la integración de datos de proveedores externos y actualizaciones de precios en tiempo real.",
                        "Cumplimiento de estándares de seguridad internacionales y políticas de privacidad de datos.",
                     ],
                     tags: ["Estudio diseño", "Agencia creativa", "Logística", "Construcción"],
                     need: ["Mejorar rentabilidad de servicios", "Centralizar información"],
                  },
                  {
                     title: "Integración de herramientas End2End para eCommerce",

                     challenge:
                        "Crear y desarrollar una integración de APIs que integre ERP, CMS, diferentes marketplaces y proveedores de Third-Party Logistics (3PLs) para la industria de Dropshipping y Logística. El objetivo es mejorar la eficiencia operativa y la experiencia del cliente al simplificar la gestión de compras, ventas y logística.",
                     features: [
                        "Interfaz única para gestionar operaciones en diferentes plataformas de comercio electrónico y marketplaces.",
                        "Integración de ERP para una gestión eficiente de los recursos y el inventario.",
                        "Conexión con 3PLs para optimizar el proceso de envío y entrega.",
                        "Herramientas analíticas avanzadas a través de Google Looker para la toma de decisiones basada en datos.",
                        "Sincronización en tiempo real de pedidos y existencias entre mercados y el sistema de gestión.",
                     ],
                     solution:
                        "La implementación de un Orquestador de API unificado que conecta Odoo (ERP), Prestashop (CMS), Huboo (3PL), y Amazon Selling Central, permite una visión completa del proceso de comercio electrónico. Esta solución facilita la automatización y sincronización entre plataformas, asegurando una gestión fluida y transparente de extremo a extremo.",
                     tools: [
                        "Odoo como sistema ERP para la administración centralizada de la empresa.",
                        "Prestashop para la gestión de contenidos y tiendas online.",
                        "Huboo como sistema de gestión de logística y envíos.",
                        "Amazon Selling Central para la integración con el marketplace de Amazon.",
                        "Google Looker para análisis de datos y reportes avanzados.",
                     ],
                     tags: ["Logística", "Fabricación", "eCommerce"],
                     need: ["Mejorar la seguridad", "Evitar errores manuales", "Centralizar información"],
                  },
                  {
                     title: "Plataforma Integrada para Agencias Creativas",

                     challenge:
                        "Implementar una solución que integre herramientas de gestión de proyectos, CRM, y gestión de tareas para agencias creativas. El objetivo es mejorar la planificación de campañas, la gestión de recursos creativos y la comunicación con clientes.",
                     features: [
                        "Gestión centralizada de proyectos y clientes.",
                        "Integración de CRM para seguimiento de clientes y oportunidades de negocio.",
                        "Herramientas de gestión de tareas y colaboración para equipos creativos.",
                        "Visualización en tiempo real del progreso de los proyectos y asignación de recursos.",
                        "Análisis de desempeño de campañas y proyectos.",
                     ],
                     solution:
                        "Solución La integración de herramientas como Adobe Creative Cloud (creación de contenido), Trello (gestión de tareas), Slack (comunicación y colaboración), y Salesforce (CRM) proporciona una plataforma robusta para la gestión de campañas y proyectos. Esta solución permite una mejor planificación, seguimiento y análisis de las actividades creativas, asegurando una comunicación fluida con los clientes.",
                     tools: [
                        "Adobe Creative Cloud: Para la creación y edición de contenido creativo, incluyendo diseño gráfico, video y otros medios digitales.",
                        "Trello: Para la gestión de tareas y proyectos, permitiendo la organización visual y el seguimiento del progreso de cada tarea.",
                        "Slack: Para la comunicación y colaboración en tiempo real entre los miembros del equipo, facilitando la coordinación y el intercambio de ideas.",
                        "Salesforce: Para la gestión de relaciones con clientes, seguimiento de oportunidades de negocio y automatización de marketing.",
                        "Zapier: Para la integración y automatización de flujos de trabajo entre las distintas herramientas, asegurando una sincronización de datos eficiente.",
                        "Google Analytics: Para el análisis de datos y la evaluación del rendimiento de campañas y proyectos creativos.",
                     ],
                     tags: ["Estudio diseño", "Agencia creativa", "eCommerce"],
                     need: ["Gestión de clientes", "Gestión de proyectos y tareas", "Centralizar información"],
                  },
               ],
               faqsDropdown: [
                  { title: "Producto digital" },
                  {
                     question: "¿Qué es un producto digital a medida?",
                     answer:
                        "Un producto digital cumple las necesidades de los usuarios, los objetivos de negocio y las oportunidades del mercado, para ofrecer la mejor solución al cliente. Se diferencia de las soluciones estándar en que se adapta a los procesos y herramientas específicas del cliente, ofreciendo una mayor flexibilidad y eficiencia.",
                  },
                  {
                     question: "¿Cómo os aseguráis de entender lo que necesito?",
                     answer:
                        "Nuestro proceso comienza con reuniones de descubrimiento y análisis en las que profundizamos en los casos de uso para asegurarnos que comprendemos todas las necesidades antes de empezar el desarrollo.",
                  },
                  {
                     question: "¿Por qué elegir una solución de software a medida en lugar de una estándar?",
                     answer:
                        "Las soluciones estándar suelen ser genéricas para cualquier tipo de negocio, suelen incluir funciones innecesarias que complican su uso y no se suelen “integrar” fácilmente con otras soluciones que ya se tengan integradas. Una solución a medida se diseña para integrarse perfectamente con su manera de trabajar, mejorando la productividad y la eficiencia.",
                  },
                  {
                     question: "¿Tendré soporte y mantenimiento cuando acabe el desarrollo?",
                     answer:
                        "¡Por supuesto! Si quieres que nosotros nos encarguemos del mantenimiento y soporte, lo haremos ya que tenemos un equipo dedicado a ello donde estaremos encantados de solucionar todos los problemas que puedan surgir.",
                  },
                  { title: "Propiedad" },
                  {
                     question: "¿Quién desarrollará mi solución?",
                     answer:
                        "En gigson solutions contamos con diferentes colaboradres especializados en cada parte del proceso para dar un servicio completo y adaptado a las necesidades del cliente como: desarrollo software, usabilidad, marketing y gráfico, legal etc.",
                  },
                  {
                     question: "¿Seré propietario de mi solución?",
                     answer: "Si quieres, podrás ser el único propietario del producto que desarrollemos para obtener una ventaja competitiva.",
                  },
                  { title: "Desarrollo del producto" },
                  {
                     question: "¿Qué diferencia hay entre Gigson Solutions y contratar a un desarrollador?",
                     answer:
                        "La principal diferencia es que un desarrollador implementará lo que tu pienses, definas y priorices. En raras ocasiones se preguntará aspectos como si es lo que realmente necesita el negocio, el modelo de pricing o en la seguridad de la información.",
                  },
                  {
                     question: "¿Cómo se maneja la seguridad y la privacidad en los nuevos productos?",
                     answer:
                        "La seguridad y la privacidad son una prioridad en todas nuestras soluciones. Adoptamos prácticas de codificación segura y podemos certificar los productos que desarrollamos siguiendo estándares como GDPR, SOC2 o HIPAA.",
                  },
                  {
                     question: "¿Puedo coordinar yo mismo el desarrollo del producto?",
                     answer:
                        "Sí, no obstante no lo recomendamos ya que la falta de experiencia en la gestión de equipos técnicos puede conducir a malentendidos en la comunicación, una mala gestión de riesgos y de recursos.",
                  },
                  {
                     question: "¿Nos hemos dejado algo por contestar?",
                     answer:
                        "Estaremos encantados de resolverte cualquier otra cuestión. Puedes contactarnos en info@gigsonsolutions.com o a través de nuestro formulario.",
                     cta: "¿Hablamos?",
                  },
               ],
               form: {
                  title: "Estamos listos para ayudarte",
                  name: {
                     label: "Mi nombre es",
                     placeholder: "Nombre y apellido",
                  },
                  service: {
                     label: "y estoy interesado en",
                     placeholder: "Servicio",
                     services: ["Desarrollo software", "Ciberseguridad", "Consultoría tecnológica"],
                  },
                  budget: {
                     label: "El presupuesto para mi proyecto es",
                     placeholder: "No sé",
                  },
                  email: {
                     label: "Me puedes contactar en este email",
                     placeholder: "nombre@ejemplo.com",
                  },
                  details: {
                     label: "Te cuento más sobre mi proyecto",
                     placeholder: "Detalles del proyecto (opcional)",
                  },
                  checkbox: {
                     first: "He leído la ",
                     second: "política legal",
                     third: " y acepto el procesamiento de mi información personal.",
                  },
                  send: "ENVIAR SOLICITUD",
               },
               notFound: {
                  title: "<span>Oops... </span>",
                  title2: "Parece que nos hemos perdido",
                  cta: "VOLVER A LA HOME",
                  description: "La página que buscas parece que ya no está diponible",
                  banner404: "error 404",
               },
               policity: {
                  h2_1: "Política de protección de datos",
                  h3_1: "1. OBJETO Y ACEPTACIÓN",
                  pc_1_1:
                     "El presente aviso legal regula el uso del sitio web www.somosgigson.com (en adelante, LA WEB), del que es titular Gigson (en adelante, EL PROPIETARIO DE LA WEB).",
                  pc_1_2:
                     "La navegación por el sitio web de EL PROPIETARIO DE LA WEB atribuye la condición de usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal, que pueden sufrir modificaciones.",
                  pc_1_3:
                     "El usuario se obliga a hacer un uso correcto del sitio web de conformidad con las leyes, la buena fe, el orden público, los usos del tráfico y el presente Aviso Legal. El usuario responderá frente a EL PROPIETARIO DE LA WEB o frente a terceros, de cualesquiera daños y perjuicios que pudieran causarse como consecuencia del incumplimiento de dicha obligación.",
                  h3_2: "2. IDENTIFICACIÓN Y COMUNICACIONES",
                  pc_2_1:
                     "EL PROPIETARIO DE LA WEB, en cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, le informa que:",
                  pc_2_2: "Su denominación social es: Awesomely OÜ",
                  pc_2_3: "Número de VAT: EE102613528",
                  pc_2_4: "Su domicilio social está en: Lootsa Tn 2a Harju, 11415, Tallinn, Estonia",
                  pc_2_5: "Para comunicarse con nosotros, ponemos a su disposición diferentes medios de contacto que detallamos a continuación:",
                  pc_2_6: "Teléfono: +34630840225",
                  pc_2_7: "Email: hello@awesomelygroup.com",
                  pc_2_8:
                     "Todas las notificaciones y comunicaciones entre los usuarios y EL PROPIETARIO DE LA WEB se considerarán eficaces, a todos los efectos, cuando se realicen a través de correo postal o cualquier otro medio de los detallados anteriormente.",
                  h3_3: "3. CONDICIONES DE ACCESO Y UTILIZACIÓN",
                  pc_3_1:
                     "El sitio web y sus servicios son de acceso libre y gratuito, no obstante, EL PROPIETARIO DE LA WEB condiciona la utilización de algunos de los servicios ofrecidos en su web a la previa cumplimentación del correspondiente formulario.",
                  pc_3_2:
                     "El usuario garantiza la autenticidad y actualidad de todos aquellos datos que comunique a EL PROPIETARIO DE LA WEB y será el único responsable de las manifestaciones falsas o inexactas que realice.",
                  pc_3_3:
                     "El usuario se compromete expresamente a hacer un uso adecuado de los contenidos y servicios de EL PROPIETARIO DE LA WEB y a no emplearlos para, entre otros:",
                  ps_3_1:
                     "1. Difundir contenidos delictivos, violentos, pornográficos, racistas, xenófobo, ofensivos, de apología del terrorismo o, en general, contrarios a la ley o al orden público.",
                  ps_3_2:
                     "2. Introducir en la red virus informáticos o realizar actuaciones susceptibles de alterar, estropear, interrumpir o generar errores o daños en los documentos electrónicos, datos o sistemas físicos y lógicos de EL PROPIETARIO DE LA WEB o de terceras personas; así como obstaculizar el acceso de otros usuarios al sitio web y a sus servicios mediante el consumo masivo de los recursos informáticos a través de los cuales EL PROPIETARIO DE LA WEB presta sus servicios.",
                  ps_3_3:
                     "3. Intentar acceder a las cuentas de correo electrónico de otros usuarios o a áreas restringidas de los sistemas informáticos de EL PROPIETARIO DE LA WEB o de terceros y, en su caso, extraer información.",
                  ps_3_4:
                     "4. Vulnerar los derechos de propiedad intelectual o industrial, así como violar la confidencialidad de la información de EL PROPIETARIO DE LA WEB o de terceros.",
                  ps_3_5: "5. Suplantar la identidad de otro usuario, de las administraciones públicas o de un tercero.",
                  ps_3_6:
                     "6. Reproducir, copiar, distribuir, poner a disposición de, o cualquier otra forma de comunicación pública, transformar o modificar los contenidos, a menos que se cuente con la autorización del titular de los correspondientes derechos o ello resulte legalmente permitido.",
                  ps_3_7:
                     "7. Recabar datos con finalidad publicitaria y de remitir publicidad de cualquier clase y comunicaciones con fines de venta u otras de naturaleza comercial sin que medie su previa solicitud o consentimiento.",
                  pc_3_4:
                     "Todos los contenidos del sitio web, como textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a EL PROPIETARIO DE LA WEB, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.",
                  pc_3_5:
                     "En definitiva, los usuarios que accedan a este sitio web pueden visualizar los contenidos y efectuar, en su caso, copias privadas autorizadas siempre que los elementos reproducidos no sean cedidos posteriormente a terceros, ni se instalen a servidores conectados a redes, ni sean objeto de ningún tipo de explotación.",
                  pc_3_6:
                     "Asimismo, todas las marcas, nombres comerciales o signos distintivos de cualquier clase que aparecen en el sitio web son propiedad de EL PROPIETARIO DE LA WEB, sin que pueda entenderse que el uso o acceso al mismo atribuya al usuario derecho alguno sobre los mismos.",
                  pc_3_7:
                     "La distribución, modificación, cesión o comunicación pública de los contenidos y cualquier otro acto que no haya sido expresamente autorizado por el titular de los derechos de explotación quedan prohibidos.",
                  pc_3_8:
                     "El establecimiento de un hiperenlace no implica en ningún caso la existencia de relaciones entre EL PROPIETARIO DE LA WEB y el propietario del sitio web en la que se establezca, ni la aceptación y aprobación por parte de EL PROPIETARIO DE LA WEB de sus contenidos o servicios. Aquellas personas que se propongan establecer un hiperenlace previamente deberán solicitar autorización por escrito a EL PROPIETARIO DE LA WEB.",
                  pc_3_9:
                     "En todo caso, el hiperenlace únicamente permitirá el acceso a la home-page o página de inicio de nuestro sitio web, asimismo deberá abstenerse de realizar manifestaciones o indicaciones falsas, inexactas o incorrectas sobre EL PROPIETARIO DE LA WEB, o incluir contenidos ilícitos, contrarios a las buenas costumbres y al orden público.",
                  pc_3_10:
                     "EL PROPIETARIO DE LA WEB no se responsabiliza del uso que cada usuario le dé a los materiales puestos a disposición en este sitio web ni de las actuaciones que realice en base a los mismos.",
                  h3_4: "4. POLÍTICA DE PRIVACIDAD",
                  pc_4_1: "Quién es el Responsable de tratamiento de sus datos:",
                  pc_4_2: "El responsable de tratamiento se encuentra identificado en el expositivo 1 de este Aviso Legal.",
                  pc_4_3: "Qué tipo de datos tenemos sobre su persona y cómo los hemos obtenido",
                  pc_4_4: "Las categorías de datos personales que tratamos de clientes y proveedores son:",
                  ps_4_1: "1. Datos de identificación",
                  ps_4_2: "2. Direcciones postales o electrónicas",
                  ps_4_3: "3. Información comercial",
                  ps_4_4: "4. Datos económicos y de transacciones",
                  pc_4_5: "En ningún caso tratamos datos especialmente protegidos:",
                  pc_4_6:
                     "Todos los datos arriba mencionados los hemos obtenido o directamente de Usted mediante la presentación de una oferta comercial, propuesta contractual, etc. o mediante su empresa al facilitarnos los datos de identificación y demás información necesaria para llevar al cabo el objeto de la relación contractual entre las partes. Será una obligación suya o de su empresa facilitarnos los datos actualizados en caso de modificación.",
               },
               notice: {
                  h2_1: "Política de protección de datos",
                  h3_1: "1. OBJETO Y ACEPTACIÓN",
                  pc_1_1:
                     "El presente aviso legal regula el uso del sitio web www.somosgigson.com (en adelante, LA WEB), del que es titular Gigson (en adelante, EL PROPIETARIO DE LA WEB).",
                  pc_1_2:
                     "La navegación por el sitio web de EL PROPIETARIO DE LA WEB atribuye la condición de usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal, que pueden sufrir modificaciones.",
                  pc_1_3:
                     "El usuario se obliga a hacer un uso correcto del sitio web de conformidad con las leyes, la buena fe, el orden público, los usos del tráfico y el presente Aviso Legal. El usuario responderá frente a EL PROPIETARIO DE LA WEB o frente a terceros, de cualesquiera daños y perjuicios que pudieran causarse como consecuencia del incumplimiento de dicha obligación.",
                  h3_2: "2. IDENTIFICACIÓN Y COMUNICACIONES",
                  pc_2_1:
                     "EL PROPIETARIO DE LA WEB, en cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, le informa que:",
                  pc_2_2: "Su denominación social es: Awesomely OÜ",
                  pc_2_3: "Número de VAT: EE102613528",
                  pc_2_4: "Su domicilio social está en: Lootsa Tn 2a Harju, 11415, Tallinn, Estonia",
                  pc_2_5: "Para comunicarse con nosotros, ponemos a su disposición diferentes medios de contacto que detallamos a continuación:",
                  pc_2_6: "Teléfono: +34630840225",
                  pc_2_7: "Email: hello@awesomelygroup.com",
                  pc_2_8:
                     "Todas las notificaciones y comunicaciones entre los usuarios y EL PROPIETARIO DE LA WEB se considerarán eficaces, a todos los efectos, cuando se realicen a través de correo postal o cualquier otro medio de los detallados anteriormente.",
                  h3_3: "3. CONDICIONES DE ACCESO Y UTILIZACIÓN",
                  pc_3_1:
                     "El sitio web y sus servicios son de acceso libre y gratuito, no obstante, EL PROPIETARIO DE LA WEB condiciona la utilización de algunos de los servicios ofrecidos en su web a la previa cumplimentación del correspondiente formulario.",
                  pc_3_2:
                     "El usuario garantiza la autenticidad y actualidad de todos aquellos datos que comunique a EL PROPIETARIO DE LA WEB y será el único responsable de las manifestaciones falsas o inexactas que realice.",
                  pc_3_3:
                     "El usuario se compromete expresamente a hacer un uso adecuado de los contenidos y servicios de EL PROPIETARIO DE LA WEB y a no emplearlos para, entre otros:",
                  ps_3_1:
                     "1. Difundir contenidos delictivos, violentos, pornográficos, racistas, xenófobo, ofensivos, de apología del terrorismo o, en general, contrarios a la ley o al orden público.",
                  ps_3_2:
                     "2. Introducir en la red virus informáticos o realizar actuaciones susceptibles de alterar, estropear, interrumpir o generar errores o daños en los documentos electrónicos, datos o sistemas físicos y lógicos de EL PROPIETARIO DE LA WEB o de terceras personas; así como obstaculizar el acceso de otros usuarios al sitio web y a sus servicios mediante el consumo masivo de los recursos informáticos a través de los cuales EL PROPIETARIO DE LA WEB presta sus servicios.",
                  ps_3_3:
                     "3. Intentar acceder a las cuentas de correo electrónico de otros usuarios o a áreas restringidas de los sistemas informáticos de EL PROPIETARIO DE LA WEB o de terceros y, en su caso, extraer información.",
                  ps_3_4:
                     "4. Vulnerar los derechos de propiedad intelectual o industrial, así como violar la confidencialidad de la información de EL PROPIETARIO DE LA WEB o de terceros.",
                  ps_3_5: "5. Suplantar la identidad de otro usuario, de las administraciones públicas o de un tercero.",
                  ps_3_6:
                     "6. Reproducir, copiar, distribuir, poner a disposición de, o cualquier otra forma de comunicación pública, transformar o modificar los contenidos, a menos que se cuente con la autorización del titular de los correspondientes derechos o ello resulte legalmente permitido.",
                  ps_3_7:
                     "7. Recabar datos con finalidad publicitaria y de remitir publicidad de cualquier clase y comunicaciones con fines de venta u otras de naturaleza comercial sin que medie su previa solicitud o consentimiento.",
                  pc_3_4:
                     "Todos los contenidos del sitio web, como textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a EL PROPIETARIO DE LA WEB, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.",
                  pc_3_5:
                     "En definitiva, los usuarios que accedan a este sitio web pueden visualizar los contenidos y efectuar, en su caso, copias privadas autorizadas siempre que los elementos reproducidos no sean cedidos posteriormente a terceros, ni se instalen a servidores conectados a redes, ni sean objeto de ningún tipo de explotación.",
                  pc_3_6:
                     "Asimismo, todas las marcas, nombres comerciales o signos distintivos de cualquier clase que aparecen en el sitio web son propiedad de EL PROPIETARIO DE LA WEB, sin que pueda entenderse que el uso o acceso al mismo atribuya al usuario derecho alguno sobre los mismos.",
                  pc_3_7:
                     "La distribución, modificación, cesión o comunicación pública de los contenidos y cualquier otro acto que no haya sido expresamente autorizado por el titular de los derechos de explotación quedan prohibidos.",
                  pc_3_8:
                     "El establecimiento de un hiperenlace no implica en ningún caso la existencia de relaciones entre EL PROPIETARIO DE LA WEB y el propietario del sitio web en la que se establezca, ni la aceptación y aprobación por parte de EL PROPIETARIO DE LA WEB de sus contenidos o servicios. Aquellas personas que se propongan establecer un hiperenlace previamente deberán solicitar autorización por escrito a EL PROPIETARIO DE LA WEB.",
                  pc_3_9:
                     "En todo caso, el hiperenlace únicamente permitirá el acceso a la home-page o página de inicio de nuestro sitio web, asimismo deberá abstenerse de realizar manifestaciones o indicaciones falsas, inexactas o incorrectas sobre EL PROPIETARIO DE LA WEB, o incluir contenidos ilícitos, contrarios a las buenas costumbres y al orden público.",
                  pc_3_10:
                     "EL PROPIETARIO DE LA WEB no se responsabiliza del uso que cada usuario le dé a los materiales puestos a disposición en este sitio web ni de las actuaciones que realice en base a los mismos.",
                  h3_4: "4. POLÍTICA DE PRIVACIDAD",
                  pc_4_1: "Quién es el Responsable de tratamiento de sus datos:",
                  pc_4_2: "El responsable de tratamiento se encuentra identificado en el expositivo 1 de este Aviso Legal.",
                  pc_4_3: "Qué tipo de datos tenemos sobre su persona y cómo los hemos obtenido",
                  pc_4_4: "Las categorías de datos personales que tratamos de clientes y proveedores son:",
                  ps_4_1: "1. Datos de identificación",
                  ps_4_2: "2. Direcciones postales o electrónicas",
                  ps_4_3: "3. Información comercial",
                  ps_4_4: "4. Datos económicos y de transacciones",
                  pc_4_5: "En ningún caso tratamos datos especialmente protegidos:",
                  pc_4_6:
                     "Todos los datos arriba mencionados los hemos obtenido o directamente de Usted mediante la presentación de una oferta comercial, propuesta contractual, etc. o mediante su empresa al facilitarnos los datos de identificación y demás información necesaria para llevar al cabo el objeto de la relación contractual entre las partes. Será una obligación suya o de su empresa facilitarnos los datos actualizados en caso de modificación.",
               },
               cookies: {
                  h2_1: "Política de protección de datos",
                  h3_1: "1. OBJETO Y ACEPTACIÓN",
                  pc_1_1:
                     "El presente aviso legal regula el uso del sitio web www.somosgigson.com (en adelante, LA WEB), del que es titular Gigson (en adelante, EL PROPIETARIO DE LA WEB).",
                  pc_1_2:
                     "La navegación por el sitio web de EL PROPIETARIO DE LA WEB atribuye la condición de usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal, que pueden sufrir modificaciones.",
                  pc_1_3:
                     "El usuario se obliga a hacer un uso correcto del sitio web de conformidad con las leyes, la buena fe, el orden público, los usos del tráfico y el presente Aviso Legal. El usuario responderá frente a EL PROPIETARIO DE LA WEB o frente a terceros, de cualesquiera daños y perjuicios que pudieran causarse como consecuencia del incumplimiento de dicha obligación.",
                  h3_2: "2. IDENTIFICACIÓN Y COMUNICACIONES",
                  pc_2_1:
                     "EL PROPIETARIO DE LA WEB, en cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, le informa que:",
                  pc_2_2: "Su denominación social es: Awesomely OÜ",
                  pc_2_3: "Número de VAT: EE102613528",
                  pc_2_4: "Su domicilio social está en: Lootsa Tn 2a Harju, 11415, Tallinn, Estonia",
                  pc_2_5: "Para comunicarse con nosotros, ponemos a su disposición diferentes medios de contacto que detallamos a continuación:",
                  pc_2_6: "Teléfono: +34630840225",
                  pc_2_7: "Email: hello@awesomelygroup.com",
                  pc_2_8:
                     "Todas las notificaciones y comunicaciones entre los usuarios y EL PROPIETARIO DE LA WEB se considerarán eficaces, a todos los efectos, cuando se realicen a través de correo postal o cualquier otro medio de los detallados anteriormente.",
                  h3_3: "3. CONDICIONES DE ACCESO Y UTILIZACIÓN",
                  pc_3_1:
                     "El sitio web y sus servicios son de acceso libre y gratuito, no obstante, EL PROPIETARIO DE LA WEB condiciona la utilización de algunos de los servicios ofrecidos en su web a la previa cumplimentación del correspondiente formulario.",
                  pc_3_2:
                     "El usuario garantiza la autenticidad y actualidad de todos aquellos datos que comunique a EL PROPIETARIO DE LA WEB y será el único responsable de las manifestaciones falsas o inexactas que realice.",
                  pc_3_3:
                     "El usuario se compromete expresamente a hacer un uso adecuado de los contenidos y servicios de EL PROPIETARIO DE LA WEB y a no emplearlos para, entre otros:",
                  ps_3_1:
                     "1. Difundir contenidos delictivos, violentos, pornográficos, racistas, xenófobo, ofensivos, de apología del terrorismo o, en general, contrarios a la ley o al orden público.",
                  ps_3_2:
                     "2. Introducir en la red virus informáticos o realizar actuaciones susceptibles de alterar, estropear, interrumpir o generar errores o daños en los documentos electrónicos, datos o sistemas físicos y lógicos de EL PROPIETARIO DE LA WEB o de terceras personas; así como obstaculizar el acceso de otros usuarios al sitio web y a sus servicios mediante el consumo masivo de los recursos informáticos a través de los cuales EL PROPIETARIO DE LA WEB presta sus servicios.",
                  ps_3_3:
                     "3. Intentar acceder a las cuentas de correo electrónico de otros usuarios o a áreas restringidas de los sistemas informáticos de EL PROPIETARIO DE LA WEB o de terceros y, en su caso, extraer información.",
                  ps_3_4:
                     "4. Vulnerar los derechos de propiedad intelectual o industrial, así como violar la confidencialidad de la información de EL PROPIETARIO DE LA WEB o de terceros.",
                  ps_3_5: "5. Suplantar la identidad de otro usuario, de las administraciones públicas o de un tercero.",
                  ps_3_6:
                     "6. Reproducir, copiar, distribuir, poner a disposición de, o cualquier otra forma de comunicación pública, transformar o modificar los contenidos, a menos que se cuente con la autorización del titular de los correspondientes derechos o ello resulte legalmente permitido.",
                  ps_3_7:
                     "7. Recabar datos con finalidad publicitaria y de remitir publicidad de cualquier clase y comunicaciones con fines de venta u otras de naturaleza comercial sin que medie su previa solicitud o consentimiento.",
                  pc_3_4:
                     "Todos los contenidos del sitio web, como textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a EL PROPIETARIO DE LA WEB, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.",
                  pc_3_5:
                     "En definitiva, los usuarios que accedan a este sitio web pueden visualizar los contenidos y efectuar, en su caso, copias privadas autorizadas siempre que los elementos reproducidos no sean cedidos posteriormente a terceros, ni se instalen a servidores conectados a redes, ni sean objeto de ningún tipo de explotación.",
                  pc_3_6:
                     "Asimismo, todas las marcas, nombres comerciales o signos distintivos de cualquier clase que aparecen en el sitio web son propiedad de EL PROPIETARIO DE LA WEB, sin que pueda entenderse que el uso o acceso al mismo atribuya al usuario derecho alguno sobre los mismos.",
                  pc_3_7:
                     "La distribución, modificación, cesión o comunicación pública de los contenidos y cualquier otro acto que no haya sido expresamente autorizado por el titular de los derechos de explotación quedan prohibidos.",
                  pc_3_8:
                     "El establecimiento de un hiperenlace no implica en ningún caso la existencia de relaciones entre EL PROPIETARIO DE LA WEB y el propietario del sitio web en la que se establezca, ni la aceptación y aprobación por parte de EL PROPIETARIO DE LA WEB de sus contenidos o servicios. Aquellas personas que se propongan establecer un hiperenlace previamente deberán solicitar autorización por escrito a EL PROPIETARIO DE LA WEB.",
                  pc_3_9:
                     "En todo caso, el hiperenlace únicamente permitirá el acceso a la home-page o página de inicio de nuestro sitio web, asimismo deberá abstenerse de realizar manifestaciones o indicaciones falsas, inexactas o incorrectas sobre EL PROPIETARIO DE LA WEB, o incluir contenidos ilícitos, contrarios a las buenas costumbres y al orden público.",
                  pc_3_10:
                     "EL PROPIETARIO DE LA WEB no se responsabiliza del uso que cada usuario le dé a los materiales puestos a disposición en este sitio web ni de las actuaciones que realice en base a los mismos.",
                  h3_4: "4. POLÍTICA DE PRIVACIDAD",
                  pc_4_1: "Quién es el Responsable de tratamiento de sus datos:",
                  pc_4_2: "El responsable de tratamiento se encuentra identificado en el expositivo 1 de este Aviso Legal.",
                  pc_4_3: "Qué tipo de datos tenemos sobre su persona y cómo los hemos obtenido",
                  pc_4_4: "Las categorías de datos personales que tratamos de clientes y proveedores son:",
                  ps_4_1: "1. Datos de identificación",
                  ps_4_2: "2. Direcciones postales o electrónicas",
                  ps_4_3: "3. Información comercial",
                  ps_4_4: "4. Datos económicos y de transacciones",
                  pc_4_5: "En ningún caso tratamos datos especialmente protegidos:",
                  pc_4_6:
                     "Todos los datos arriba mencionados los hemos obtenido o directamente de Usted mediante la presentación de una oferta comercial, propuesta contractual, etc. o mediante su empresa al facilitarnos los datos de identificación y demás información necesaria para llevar al cabo el objeto de la relación contractual entre las partes. Será una obligación suya o de su empresa facilitarnos los datos actualizados en caso de modificación.",
               },
               cookiesBanner: {
                  h2: "TAMBIÉN TENEMOS COOKIES",
                  p: "Utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarte publicidad relacionada con tus preferencias en base a un perfil elaborado a partir de tus hábitos de navegación (por ejemplo, páginas visitadas). Puedes aceptarlas o rechazarlas en los siguientes botones.",
                  btnAccept: "ACEPTAR",
                  btnDenie: "RECHAZAR",
               },
            },
         },
      },
   });
