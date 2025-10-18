![LogoBusReservation](https://github.com/user-attachments/assets/4f2ab436-d022-469b-b5e9-33238d082253)
<h1 align="center"> BusReservation </h1>
<p align="left">
<img src="https://img.shields.io/badge/STATUS-EN%20DESAROLLO-green">
</p>

## Indice
-[Título e imagen de portada](#Título-e-imagen-de-portada) <br/>
-[Índice](#índice) <br/>
-[Descripción del proyecto y sus Caracteristicas](#descripción-del-proyecto-y-us-caracteristicas) <br/>
-[Estado del proyecto](#Estado-del-proyecto) <br/>
-[Acceso al proyecto](#acceso-proyecto) <br/>
-[Tecnologías utilizadas](#tecnologías-utilizadas) <br/>
-[Personas Contribuyentes](#personas-contribuyentes) <br/>
-[Personas-Desarrolladores del Proyecto](#personas-desarrolladores) <br/>
-[Licencia](#licencia) <br/>
-[Conclusión](#conclusión) <br/>

## Descripición del Proyecto y sus caracteristicas
BusReservation es una aplicación web Full Stack diseñada para la reserva de boletos de autobuses interprovinciales en Ecuador, brindando una experiencia completa tanto para los usuarios como para los conductores.

Los usuarios pueden registrarse e iniciar sesión utilizando su cédula, explorar y buscar rutas disponibles entre distintos destinos, seleccionar y reservar asientos, y comprar boletos de manera segura. Además, la aplicación permite a los usuarios visualizar información adicional sobre hoteles y alojamientos en su destino, optimizando la planificación de su viaje.

Por otro lado, los conductores tienen acceso a herramientas de navegación que les permiten identificar la ruta más corta entre origen y destino, facilitando la optimización de tiempo y la eficiencia en sus recorridos.

En conjunto, la aplicación integra la gestión de reservas, la optimización de rutas y la visualización de información turística en un entorno web moderno y seguro, garantizando que tanto usuarios como conductores puedan aprovechar al máximo su tiempo y planificar sus viajes de forma eficiente.

## Estado del proyecto
<h4 align="center">
:construction: Proyecto en construcción :construction:
</h4>

## Acceso al Proyecto
-Comenzamos con la instalación local, primero hay que clonarse el repositorio <br/>
git clone https://github.com/ElPaul593/BusReservationFullStack.git <br/>
Abrimos VS Code y procedemos a abrir la carpeta donde se encuentre nuestro archivo clonado. <br/>
Abrimos la terminal y colocamos el siguiente comando  <br/>
-cd backend <br/>
-npm install <br/>
Esto será útil ya que con esto instalaremos las dependencias. <br/>
*NO OLVIDAR* Que en el .env están credenciales no oficiales de nuestra base de datos por lo que toca editar lo siguiente. <br/>
-MONGO_URI=tu_mongo_uri <br/>
-PORT=5000 <br/>
-JWT_SECRET=tu_clave_secreta <br/>
Finalmente para ejecutar nuestro backend se lo realizara con el comando <br/>
-npm run dev <br/>
<br/>
<br/>
ACCESO FRONTEND <br/>
Para correr nuestro Frontend abriremos una nueva terminal.<br/>
Colocamos los comandos <br/>
-cd frontend <br/>
-npm install <br/>
-npm run dev <br/>
Y listo, finalmente el proyecto está corriendo, adicionalmente se adjuntaron 2 README uno específicamente para el Frontend y otro para el Backend.
## Tecnolog[ias utilizadas
#### Frontend
- ![React](https://img.shields.io/badge/React-18-blue)  + Vite
- React Router
- Axios

#### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-14-green)  + Express.js
- ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)  + Mongoose
- JWT para autenticación

#### Otras herramientas
- CORS (control de acceso entre dominios)
- Formateo con CSS modular y responsive

## AUTORES
Paúl Larrea y Pablo Criollo Escobar.
