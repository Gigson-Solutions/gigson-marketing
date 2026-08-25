<!--
Procedencia: documento redactado por Alfonso Ojeda (Taurusrank, info@taurusrank.com),
recibido por email el 21/08/2026. Reproducido literalmente; no editar el contenido.
Es la fuente de verdad sobre el criterio y la configuración de las campañas de agosto 2026.
-->

# Campañas de Google Ads \* Documento de contexto

**Empresas:** Gigson Solutions (España) y latroupe (Reino Unido)  
**Periodo:** 1 – 30 de agosto de 2026  
**Datos actualizados a:** 20 de agosto de 2026

---

## 0\. Para qué sirve este documento

Este documento recoge cómo se han montado las campañas, qué decisiones se han tomado, por qué se ha tomado cada una y qué se ha descartado por el camino. No es un informe de resultados.

Está escrito con dos usos en mente:

1. **Que se entienda el criterio.** Muchas de las decisiones importantes no se ven en la interfaz de Google Ads ni en el email diario. Están aquí explicadas.
2. **Que sirva de contexto para consultar con IA.** Si en algún momento Jaume o Emmelin, quiereis preguntarle algo a Claude sobre estas campañas, con **este documento como contexto de proyecto** evitamos una respuesta genérica de manual, y las recomendaciones que asumen presupuestos entre diez y veinte veces mayores que el nuestro. Mi idea es que si preguntáis algo sobre las campañas a Claude, las respuestas sean bastante más útiles. Hay una guía concreta en el apartado 14\.

Esto lo he escrito a mano. A partir de aquí es el documento que he generado con Claude en base al histórico y al contexto que le he dado de las campañas y de lo que he ido haciendo y cómo está todo montado.

---

## 1\. El punto de partida

El brief: **500 € por campaña, durante el mes de agosto, para ver si entra algún lead.** Tres campañas de búsqueda en Google, con un total de 1.500 € de inversión.

Toda la configuración está adaptada a este marco, así que conviene tenerlo presente.

### Las dos restricciones que se advirtieron

**Agosto es el peor mes del año para B2B.** En España el descenso de actividad es fuerte por vacaciones, y en Reino Unido también baja. Se planteó en su momento que septiembre rendiría bastante más. La decisión de mantener agosto es perfectamente razonable para una prueba: se acepta menos volumen a cambio de tener un punto de partida antes de la temporada alta.

**500 € en 30 días son 16 € al día.** Esa cifra determina casi todo lo demás: el tipo de concordancia, la estrategia de puja, cuántas palabras clave se pueden trabajar y cuántos datos se pueden recoger. 

Es un presupuesto muy bajo, pero sirve para tener un testeo de cuánto costaría entrar a jugar a las pujas de este sector, que es el objetivo principal de la prueba. Si de paso hay algún lead, y mucho mejor una conversión, el resultado será fantástico, pero no es el objetivo.

### Importante: qué se buscaba realmente

El objetivo declarado no era generar volumen de leads, sino **aprender qué búsquedas existen, cuánto cuestan y si convierten**. Es un test de viabilidad. Esa distinción importa porque cambia qué resultado se considera un éxito: un mes que termina con cero leads pero con un mapa claro de qué palabras funcionan y a qué coste ha cumplido su función.

---

## 2\. Qué significa 500 € en estos mercados

Este es el apartado más importante del documento.

Cuando se configura una campaña, Google muestra su propia estimación del presupuesto necesario para competir con normalidad en ese conjunto de palabras clave. Son cifras del propio Google, no una opinión nuestra. Esto es lo que dijo:



|  | Presupuesto diario que Google considera normal | Equivalente mensual | Lo que hemos puesto | Porcentaje |
| --- | --- | --- | --- | --- |
| **ISO 27001 (España)** | 240 € | ~7.300 € | 16 € (500 €/mes) | **6,8 %** |
| **BIM (Reino Unido)** | 122,52 € | ~3.725 € | 16 € (500 €/mes) | **13,4 %** |



Dicho de otra forma: en la campaña de ISO 27001 estamos compitiendo con **menos de la catorceava parte** del presupuesto que Google considera el estándar de esa subasta. En las de BIM, con menos de la séptima parte.

**Esto no es un problema que se pueda resolver optimizando.** Google Ads es una subasta. Cuando alguien busca "certificación ISO 27001", se disputan esa impresión varias empresas a la vez, y las que llevan 7.000 € al mes aparecen todos los días a todas horas. Nosotros aparecemos hasta que se acaban los 16 € del día.

Por eso el trabajo de estas semanas no ha ido de "conseguir más leads". Ha ido de otra cosa:

> **Cómo hacer que 16 € al día compren la información más valiosa posible.**

Que es un problema distinto, y tiene solución. La estrategia entera se explica en el apartado 3\.

### Lo que sí ha salido según lo previsto

Un dato que conviene destacar: **la estimación de coste por clic que hicimos antes de arrancar era correcta.** Para ISO 27001 se estimó una horquilla de entre 10 € y 18 €, y el real está en 12,48 €. Eso significa que el análisis previo de la subasta estaba bien hecho y que no hay sorpresas por ese lado.

Donde sí hubo desviación fue en Reino Unido: Google daba una referencia de 7,21 € por clic y el real está en 16,27 €, más del doble. Eso indica que la competencia en el nicho BIM británico es bastante más dura de lo que anticipaba Google.

---

## 3\. La estrategia: campañas HSI

La decisión de Alfonso con este contexto fue montar las tres campañas como **HSI (High Search Intent, alta intención de búsqueda)**.

La lógica es esta. Con 16 € al día y clics que cuestan entre 8 € y 25 €, van a entrar entre uno y tres clics diarios. Con tan poco margen, **cada clic tiene que ser de alguien con intención real.** Un clic malgastado en un curioso no es "un clic menos"; es el 30 % o el 50 % del presupuesto de ese día.

De ahí salen tres consecuencias que atraviesan toda la configuración:

**Se prioriza la calidad del clic sobre la cantidad.** Se renuncia deliberadamente a búsquedas con mucho volumen si son ambiguas (Alfonso hace comprobación una a una a mano para contrastar visualmente esta intención). Un ejemplo real está en el apartado 5: se descartó desde el diseño el término con más volumen de todo el nicho BIM.

**Se usa concordancia exacta al arrancar.** Es el tipo de emparejamiento más restrictivo: el anuncio solo se muestra cuando alguien busca prácticamente lo mismo que hemos definido. Con presupuestos amplios se empieza abierto y se va cerrando con los datos. Con 16 € al día no hay margen para pagar ese aprendizaje, así que se empieza cerrado y se abre solo donde los datos lo justifican.

**Se construye una lista larga de exclusiones desde el día uno.** En total hay unas **90 palabras clave negativas** repartidas entre las tres campañas. Cada una es una búsqueda por la que hemos decidido no pagar.

---

## 4\. La configuración, decisión a decisión

Estos son los ajustes de las tres campañas. Ninguno es el valor que Google trae por defecto, y cada uno responde a un motivo concreto.



| Ajuste | Qué se ha puesto | Por qué |
| --- | --- | --- |
| **Tipo de campaña** | Solo Búsqueda | Es el único formato donde el usuario declara su intención escribiéndola. Con este presupuesto no hay margen para formatos de descubrimiento. |
| **Red de Display** | Desactivada | Viene activada por defecto. Trae clics baratos de banners en webs de terceros, con intención casi nula. Se habría comido el presupuesto en días. |
| **Socios de búsqueda** | Desactivados | Buscadores de terceros con calidad muy inferior y sin control de dónde aparece el anuncio. |
| **Ubicación** | España / Reino Unido, opción **"Presencia"** | Google usa por defecto "presencia o interés", que muestra los anuncios a gente de cualquier país que "muestre interés" por España o Reino Unido. Eso trae clics desde fuera del mercado que no se pueden convertir en cliente. |
| **Idioma** | Español + inglés (ES) · Inglés (UK) | En España se añadió inglés porque hay profesionales de tecnología con el navegador configurado en inglés que buscan en español. |
| **Estrategia de puja** | Maximizar clics | Es la decisión técnica más relevante y se explica debajo de la tabla. |
| **Programación** | Lunes a viernes, horario de oficina | Servicios B2B. Nadie contrata una consultoría de seguridad de la información un domingo a las once de la noche. Concentra el presupuesto en las horas donde está el comprador. |
| **Fechas** | 1 – 30 de agosto | Fecha de fin configurada para que la campaña se pare sola y no haya gasto imprevisto. |
| **Recomendaciones automáticas** | Desactivadas | Google aplica cambios por su cuenta si se le deja: ampliar concordancias, subir presupuestos, añadir palabras clave. Con 500 € eso es inasumible. |
| **Objetivo de conversión** | Solo la acción específica de cada campaña | Las cuentas tenían acciones de conversión genéricas heredadas. Si se dejan activas, ensucian los datos y confunden al algoritmo. |
| **Recuento de conversiones** | Una por persona | Para servicios, lo relevante es cuánta gente distinta contacta, no cuántas veces envía el formulario la misma persona. |



### Por qué Maximizar clics y no puja inteligente

Google recomienda por defecto sus estrategias de **Smart Bidding** ("maximizar conversiones", "CPA objetivo"), y cualquier IA que consultes sin contexto te las va a recomendar también. Aquí serían un error.

Esas estrategias funcionan con un algoritmo de aprendizaje automático que necesita **alrededor de 30 conversiones al mes** para tener datos suficientes con los que decidir a quién mostrar el anuncio y cuánto pujar. Con nuestro presupuesto vamos a tener entre cero y cinco conversiones en todo el mes.

Un algoritmo con cinco datos no optimiza: adivina. Y adivina gastando dinero real.

**Maximizar clics** no depende de conversiones. Su instrucción es sencilla: traer el máximo de visitas posibles con el dinero disponible. Es la estrategia correcta cuando el objetivo es recoger datos, que es exactamente nuestro caso.

Esto se revisará en septiembre. Si el volumen crece, cambiar a puja inteligente pasa a tener sentido.

---

## 5\. Las palabras clave: las elegidas y las descartadas

Aquí es donde se decide el 80 % del resultado de una campaña de búsqueda.

### El criterio

Cada palabra clave candidata se pasó por tres filtros:

1. **¿Tiene volumen de búsqueda real en el mercado y el idioma correctos?**
2. **¿Quién busca esto está comprando, o está investigando, busca precios bajos?** Este es el filtro que más descarta.
3. **¿Cuánto cuesta el clic, y podemos permitírnoslo?**

### El descarte más importante: "bim manager" y "bim coordinator"

En el nicho BIM británico, los dos términos con más volumen de búsqueda son:

* `bim manager` — unas 450 búsquedas al mes
* `bim coordinator` — unas 400 búsquedas al mes

**Se descartaron los dos, deliberadamente, antes de arrancar.**

El motivo: quien escribe esos términos en Google mayoritariamente **está buscando trabajo**, no contratando el servicio. Son perfiles profesionales, no servicios. Pujar por ellos habría dado muchísimas más impresiones y muchos más clics — y un informe con números mucho más altos — pero el presupuesto se habría gastado en nada.

Esto ha quedado confirmado con los datos: en la campaña de BIM Consulting, el término "bim coordinator" ha generado 17 impresiones filtradas y ninguna ha llegado a clic de pago.

La consecuencia asumida es que **la demanda comercial real del nicho es mucho más pequeña que la demanda aparente**. Es la explicación de fondo de por qué la campaña de BIM Manager apenas ha tenido actividad, y se detalla en el apartado 10\.

### Los descartes en ISO 27001

El mismo criterio, aplicado al mercado español:



| Descartado | Motivo |
| --- | --- |
| `iso 27001` (a secas) | Búsqueda informativa. Quien la escribe quiere saber qué es la norma. Es, con diferencia, la que más volumen tiene. |
| `norma iso 27001`, `normativa iso 27001` | Consulta del texto normativo, no del servicio. |
| `curso`, `máster`, `formación` ISO 27001 | Mercado de formación, no de consultoría. |
| `auditor iso 27001`, `sueldo`, `empleo` | Búsqueda de empleo. |
| `iso 27001 pdf`, `plantilla`, `ejemplo` | Buscan documentación gratuita. |
| `iso 27001 aenor` | Búsqueda de marca de un competidor concreto. |



### Lo que sí se conservó

Solo términos donde el usuario ya ha decidido que quiere el servicio y está buscando quién se lo hace: `certificación iso 27001`, `certificación iso 27001 precio`, `implantación iso 27001`, `consultoría iso 27001`, `auditoría iso 27001`, `mantenimiento iso 27001`, `implementación iso 27001 pymes`, `empresa experta en certificación iso 27001`.

En BIM: `bim consultancy`, `bim consultants`, `bim consulting services`, `bim modelling services`, `architectural bim services`, `bim services uk`, `bim coordination`, `clash detection services`, `mep bim coordination`, `3d bim coordination`.

---

## 6\. Lo que se decidió NO hacer

Tan relevante como lo que se hizo. Cada una de estas opciones se valoró y se descartó por un motivo concreto.

**Performance Max.** Es el formato que Google promociona con más insistencia y el que sugiere en cuanto abres la cuenta. Reparte el presupuesto automáticamente entre búsqueda, YouTube, Gmail, Display y Maps, y decide él dónde gastar. Descartado por dos razones: necesita el mismo volumen de conversiones que el Smart Bidding para funcionar, y ofrece muy poca visibilidad sobre en qué se ha gastado el dinero. Con 500 € y un objetivo de aprendizaje, es exactamente lo contrario de lo que necesitamos.

**Concordancia amplia desde el inicio.** Habría multiplicado las impresiones y habría hecho que el informe pareciera mucho mejor. También habría gastado el presupuesto en búsquedas tangenciales antes de saber cuáles valen. Se abrió más tarde, y solo donde los datos lo justificaban (apartado 12).

**Campañas de marca.** Pujar por el propio nombre de la empresa es barato y da un CTR altísimo. Habría dejado un informe estupendo. Pero esa gente ya te conoce y te habría encontrado igual: es comprar tráfico que ya tenías gratis. Con un presupuesto de test, es maquillar el resultado.

**Anuncios en Display o YouTube.** Formatos de notoriedad. Funcionan cuando hay presupuesto para construir marca a lo largo de meses. Aquí no aportan nada.

**Extensiones automáticas sin revisar.** Google genera automáticamente enlaces y textos adicionales a partir del contenido de la web. Se revisaron uno a uno en lugar de dejarlos por defecto, para evitar que el anuncio prometiera cosas que la landing no cumple.

---

## 7\. La medición

Sin medición, una campaña es un gasto a ciegas. Esto es lo que se montó y cuáles son sus límites reales.

### Cómo está montado

En las tres campañas, una **conversión = un formulario enviado = un lead**. Se registra cuando el usuario llega a la página de gracias tras enviar el formulario.

* **Gigson (ISO 27001):** etiqueta `AW-17165031999`, acción `formulario_ISO_27001`, página de gracias `/es/gracias-iso27001`. Verificada.
* **latroupe (BIM):** etiqueta `AW-18339820152`, acción `LEAD_BIM`, página de gracias `/en/thank-you-bim-consultancy`. Operativa.

Además se añadieron parámetros UTM a las URLs de destino, para poder distinguir después de qué campaña y de qué palabra clave concreta viene cada visita.

### La limitación importante

**Las etiquetas de conversión solo se activan si el usuario acepta las cookies.** Quien las rechaza —y en España es una parte considerable del tráfico— envía el formulario, se recibe el correo, y Google Ads no cuenta nada.

Esto significa que **el número de conversiones de Google Ads es un mínimo, no la cifra real.** Sirve para optimizar la campaña, no para saber cuántos leads han entrado.

> **La fuente fiable para el negocio es el correo.** Si llega un formulario al buzón, es un lead, cuente Google lo que cuente.

Se ha valorado corregirlo con Consent Mode avanzado y conversiones mejoradas, pero con el volumen actual no es relevante, cuando hablamos de un puñado de conversiones al mes, revisar el correo es más fiable que cualquier arreglo de medición.  
  
De cara a la continuidad de esta campaña, sí es importante que las etiquetas carguen. Como es una prueba y lo que medimos es viabilidad, si un lead rellena un formulario, vamos a tener el email como prueba (Google Ads no optimiza la campaña para leads, pero da igual porque son 30 días, no le da tiempo).

---

## 8\. El sistema de seguimiento

Para no depender de entrar a mirar la interfaz de Google Ads a mano, se montó un sistema (scorecard con la info del setup de la campaña resumida por parte de Alfonso, para que Jaume y Emmelin tengan toda la información en un único documento + sistema de reporte automático por email, para facilitar el acceso a los datos por parte de Jaume y de Emmelin).

**Un scorecard por campaña**, en Google Sheets. Recoge toda la configuración (ajustes, palabras clave, URLs, etiquetas de conversión, estimaciones previas) y funciona como la ficha técnica de la campaña. Si mañana esto lo lleva otra persona, ahí está todo.

**Volcado automático de datos.** Se programó un script dentro de Google Ads que cada madrugada escribe en cada Sheets el detalle diario, el rendimiento de cada palabra clave y **la lista completa de términos de búsqueda reales** que han activado los anuncios. Ese último punto es el que permite decidir qué excluir con datos y no por intuición.

Un detalle de diseño: el script **reescribe siempre los últimos 60 días**, no añade la fila de ayer. Las conversiones de Google Ads se rellenan hacia atrás durante varios días, así que un sistema que fuera apilando filas dejaría los datos de la semana pasada congelados y mal.

**Correo diario automático** con el resumen de las campañas.

**Aviso de seguridad.** Si algún día los datos no se han actualizado correctamente, el sistema **no envía el correo** y avisa internamente. Preferimos que falte un correo un día a que salga uno con datos incorrectos.

---

## 9\. Cronología



| Fecha | Hito |
| --- | --- |
| 27 jul | Análisis de la landing de ISO 27001 y de la oferta. Definición del roadmap. Advertencia sobre estacionalidad y sobre la relación presupuesto/volumen. |
| 27–29 jul | Investigación de palabras clave en España: volúmenes, costes por clic y filtro por intención. Definición de las tres listas de exclusiones. |
| 29–30 jul | Redacción de los anuncios adaptados al tono de cada landing. Configuración de la medición. |
| 30 jul | Configuración de las campañas de Reino Unido. Previsiones y estimaciones por campaña. Montaje de los tres scorecards. |
| 1 ago | Arranque de las tres campañas. |
| 3–6 ago | Seguimiento diario. Verificación de que la medición dispara correctamente. |
| 7 ago | Automatización: scripts de volcado a Sheets y correo diario automático. |
| 14 ago | Primera revisión con datos. Detección del problema de calidad de tráfico en ISO 27001. |
| 17 ago | Consolidación de las dos campañas de BIM. Apertura de concordancia. |
| 20 ago | Aplicación del bloque de exclusiones en ISO 27001. Revisión intermedia. Archivo de contexto para IA. |



---

## 10\. Dónde estamos (datos a 20 de agosto)



|  | Impresiones | Clics | Inversión | CTR | Coste por clic | Formularios |
| --- | --- | --- | --- | --- | --- | --- |
| **ISO 27001 (ES)** | 1.020 | 22 | 274,65 € | 2,16 % | 12,48 € | 0 |
| **BIM Consulting (UK)** | 829 | 22 | 358,00 € | 2,65 % | 16,27 € | 0 |
| **BIM Manager (UK)** * | 112 | 1 | 8,79 € | 0,89 % | 8,79 € | 0 |
| **Total** | **1.961** | **45** | **641,44 €** |  |  | **0** |



\* Campaña pausada el 21 de agosto. Datos hasta el 13 de agosto.

### ISO 27001

El coste por clic está en la parte baja de lo previsto, lo que confirma que el análisis inicial de la subasta era correcto. Terminaremos el mes en torno a 30 clics.

El problema detectado es de **calidad del tráfico**: el 60 % de la inversión se lo estaba llevando la búsqueda "iso 27001", con tan poco margen no podemos permitir ambigüedad. Corregido el 21 de agosto (apartado 12).

Hay un segundo problema, de fondo y más relevante a medio plazo: Google puntúa la **experiencia de la landing por debajo de la media** respecto a las búsquedas por las que competimos, con un nivel de calidad de 1-2 sobre 10\. Esa puntuación encarece directamente cada clic: con el mismo dinero, un anunciante con mejor puntuación aparece más veces y paga menos. Es la palanca con más recorrido de cara a septiembre y merece una revisión específica de la landing.

### BIM Consulting

Es la campaña que mejor está funcionando. El porcentaje de clics sobre impresiones es sano, lo que indica que los anuncios conectan con quien los ve.

El dato más relevante es reciente: desde que se abrió la concordancia y se consolidó el presupuesto, **la campaña pierde el 66,8 % de las impresiones por falta de presupuesto**. Traducido: hay tres veces más demanda disponible de la que podemos pagar. Es la primera vez en todo el mes que una de las tres campañas se topa con el techo del dinero y no con el techo de la demanda.

Ese dato es el mejor argumento que tenemos para septiembre, y conviene entenderlo bien: **no es que la campaña no funcione, es que solo estamos apareciendo en una de cada tres búsquedas en las que podríamos aparecer.**

### BIM Manager

Esta campaña no ha despegado. La clave está en un dato: **perdió el 0 % de impresiones por falta de presupuesto.** El dinero nunca fue el freno; simplemente no había suficientes búsquedas.

Se explica por la combinación de dos cosas ya comentadas: la demanda comercial real del nicho de coordinación BIM es pequeña una vez descartadas las búsquedas de empleo (apartado 5), y agosto la reduce todavía más. Se ha consolidado en BIM Consulting (apartado 12).

Alfonso se anticipó a esto y cambió la configuración de esta campaña, previa solicitud de autorización a Jaume y Emmelin para hacerlo. Fue un acierto que ha ahorrado dinero.

---

## 11\. Cómo leer estos datos

Es el apartado que conviene leer antes de valorar el resultado.

**Con 45 clics acumulados, cero formularios (en teoría) nos permite concluir que las landings no convierten.**

El motivo es estadístico. Si la landing convirtiera a un 5 % —que sería un buen resultado para B2B—, lo esperable con 45 clics serían unos 2 formularios. Y en una muestra tan pequeña, la diferencia entre 2 y 0 entra dentro de lo que hace el azar.

Poniéndole el número exacto: con 45 clics y ninguna conversión, los datos son **compatibles con cualquier tasa de conversión entre el 0 % y aproximadamente el 6,7 %**. Es decir, el resultado actual es perfectamente coherente tanto con una landing que no convierte nada como con una que convierte razonablemente bien. No podemos distinguir entre esas dos hipótesis, y fingir lo contrario sería inventar.

**Para tener una respuesta con fundamento harían falta entre 200 y 300 clics.** Al ritmo actual, eso son unos cuatro o cinco meses de agosto, o aproximadamente un mes con un presupuesto tres veces mayor en temporada normal.

Esto no es una excusa: es el motivo por el que el objetivo del test se definió desde el principio como aprender qué búsquedas existen y a qué coste, y no como validar la conversión. Esa parte sí se ha conseguido y está en el apartado 5\.

---

## 12\. Cambios realizados y por qué

### ISO 27001 \* Bloque de búsquedas excluidas (21 de agosto)

**Qué se ha visto.** La palabra clave `certificación iso 27001` se llevaba 214 € de los 274 € invertidos. Pero el término que más la activaba era "iso 27001" a secas: 552 impresiones, 12 clics y 131 € de gasto en gente informándose.

**Por qué pasa.** Aunque la palabra clave está en concordancia exacta, Google interpreta la concordancia exacta como "mismo significado", no como "mismas palabras". Por eso entraban también "qué es la iso 27001", "cómo implementar iso 27001" o "27001" a secas.

**Qué se ha hecho.** Se ha añadido un bloque de exclusiones que bloquea la búsqueda genérica y sus variantes, junto con los términos de tipo formativo, documental y de empleo. La campaña conserva intacta la palabra clave comercial.

**Qué se espera.** Que el gasto diario baje. Es lo deseable: menos clics, mejor cualificados. Un informe con menos números pero con mejor tráfico.

### BIM \* Consolidación de las dos campañas (17–21 de agosto)

**Qué se ha visto.** BIM Manager no tenía demanda suficiente y BIM Consulting funcionaba mejor.

**Qué se ha hecho.** Las palabras clave de coordinación con actividad se han trasladado a un grupo propio dentro de BIM Consulting, con sus anuncios. Se ha traspasado el presupuesto y se ha pausado BIM Manager. Y, en el mismo movimiento, **se ha abierto la concordancia de exacta a frase** en los términos que ya habían demostrado tener demanda.

**Por qué se abrió la concordancia.** Esto rectifica la decisión de julio, y con motivo. En julio el riesgo era quemar el presupuesto en tráfico tangencial antes de saber qué funcionaba. A mitad de agosto el riesgo era el contrario: terminar el mes con la mitad del presupuesto sin gastar y sin datos suficientes para decidir nada. Cuando cambia el riesgo, cambia la decisión.

**Ha funcionado.** BIM Consulting pasó de perder el 3,6 % de impresiones por presupuesto a perder el 66,8 %. De 75 impresiones en una semana a 684 en la siguiente.

**Con un efecto secundario que hay que corregir.** Abrir la concordancia ha traído también búsquedas de software (Autodesk BIM 360, BIMcollab, Solibri, Procore, Revit) y de nombres de otras empresas del sector. Algunas han costado dinero real: un solo clic en una búsqueda de marca ajena costó 36,45 €. Se va a añadir un bloque de exclusiones esta semana para cerrarlo.

Es el coste normal de abrir concordancia, y era previsible: se abre, se mira qué entra, se excluye lo que no sirve.

---

## 13\. Lo que depende de Awesomely

**Microsoft Clarity, no registra datos suficientes.**

**El consentimiento de cookies.**

**Revisión de las landings, especialmente de ISO 27001\.** La puntuación de calidad de Google está en 1-2 sobre 10 y encarece cada clic. Es una tarea de septiembre, pero conviene tenerla en el radar: es probablemente la mejora con más impacto por euro invertido de todas las pendientes.

---

## 14\. Cómo usar este documento con IA

Ejemplos concretos de lo que te va a recomendar una IA sin contexto, y por qué aquí no aplica:



| Recomendación típica sin contexto | Por qué no aplica aquí |
| --- | --- |
| "Activa Smart Bidding / maximizar conversiones" | Necesita ~30 conversiones al mes. Tenemos entre 0 y 5. Apartado 4. |
| "Prueba Performance Max" | Mismo problema, y además sin visibilidad de en qué se gasta. Apartado 6. |
| "Amplía a concordancia amplia para ganar volumen" | Se hizo, de forma controlada y con criterio, y trajo tráfico de software y de marcas ajenas que hay que excluir. Apartado 12. |
| "Un CTR del 2 % es bajo, reescribe los anuncios" | Con concordancia exacta y presupuesto mínimo, los rangos normales son otros. |
| "Cero conversiones significa que la landing no convierte" | Con 45 clics no se puede afirmar eso. Apartado 11. |
| "Aumenta el presupuesto para mejorar el rendimiento" | Cierto en BIM Consulting, falso en las otras dos. La respuesta depende de si se pierden impresiones por presupuesto o por demanda. Apartado 10. |



**Preguntas que sí funcionan bien con este contexto delante:** por qué se descartó una palabra clave concreta, qué habría que hacer en septiembre con más presupuesto, cómo interpretar un dato del correo diario, o qué significa una métrica en particular.

---

## 15\. Criterios para septiembre

Definidos ahora, antes de tener los resultados de cierre, para que la decisión no se tome en caliente.

**Si el objetivo es seguir aprendiendo:** mantener la estructura actual y subir el presupuesto de BIM Consulting, que es la única campaña que ha demostrado tener más demanda que dinero. Es la inversión con retorno de información más claro.

**Si el objetivo es generar leads:** hay que asumir que 16 € al día no van a producirlos de forma consistente. La conversación entonces no es de optimización, es de presupuesto, y el apartado 2 tiene los números para tenerla con datos.

**Independientemente de lo anterior**, dos tareas que no dependen del presupuesto y que mejorarían el rendimiento en cualquier escenario: revisar la landing de ISO 27001 (por la puntuación de calidad) e instalar Clarity (para poder responder por fin a la pregunta de la conversión).

**Probar más landings, diferentes wireframes y copys**.

**Septiembre es además un mes estructuralmente mejor.** La demanda B2B se recupera con fuerza tras las vacaciones, en los dos mercados. Cualquier comparación entre agosto y septiembre tenderá a favorecer a septiembre por el mes, no por nuestro trabajo, y conviene tenerlo presente para no atribuirnos mérito ajeno.

---

## 16\. Glosario

**Impresión.** Cada vez que el anuncio se muestra en los resultados de búsqueda.

**Clic.** Cada vez que alguien pulsa el anuncio y entra en la web. Es lo que se paga.

**CTR.** Porcentaje de impresiones que acaban en clic. Mide si el anuncio resulta atractivo a quien lo ve.

**CPC (coste por clic).** Lo que se paga por cada visita. Lo fija una subasta en tiempo real, no lo fija el anunciante.

**CPL (coste por lead).** Inversión total dividida entre el número de formularios recibidos.

**Conversión.** En estas campañas, un formulario enviado. Ver el apartado 7 sobre por qué el dato de Google se queda corto.

**Palabra clave.** El término por el que decidimos competir. No es lo que el usuario escribe, sino lo que nosotros definimos.

**Término de búsqueda.** Lo que el usuario escribió realmente. Es distinto de la palabra clave, y ahí está la mayor parte de la optimización.

**Concordancia.** Cómo de estricto es el emparejamiento entre la palabra clave y lo que busca el usuario. _Exacta_ es la más restrictiva (mismo significado), _frase_ intermedia (que contenga la secuencia), _amplia_ la más abierta (cualquier cosa relacionada).

**Palabra clave negativa.** Un término por el que decidimos NO aparecer nunca.

**% de impresiones perdidas por presupuesto.** De todas las veces que podíamos haber aparecido, en cuántas no aparecimos por habernos quedado sin dinero ese día. **Es la métrica más importante de este documento.**

**% de impresiones perdidas por ranking.** Igual, pero por haber perdido la subasta frente a otro anunciante.

**Nivel de calidad.** Puntuación de 1 a 10 que Google asigna a cada palabra clave según lo relevante que le parece el anuncio y la página de destino. Una puntuación baja encarece cada clic.

**Grupo de anuncios.** Subdivisión dentro de una campaña que agrupa palabras clave afines con sus propios anuncios.

**UTM.** Etiquetas añadidas a la URL que permiten saber de qué campaña y de qué palabra clave viene cada visita.

**Landing.** La página a la que llega quien hace clic en el anuncio.

---

