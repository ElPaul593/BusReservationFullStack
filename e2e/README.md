# Cultural Trip — pruebas automatizadas de navegador

Esta suite de **Playwright** se basa en el frontend real de
[BusReservationFullStack](https://github.com/ElPaul593/BusReservationFullStack)
y automatiza las historias de usuario sin afectar cuentas ni reservas reales.

## Instalación (en la raíz del repositorio)

Requisitos: Node.js 22+ y npm. El lockfile preexistente del frontend está desincronizado; por ello, el flujo usa \`npm install\` hasta que se repare con un commit independiente.

```bash
cd frontend
npm install --no-audit --no-fund
cd ../e2e
npm install
npx playwright install chromium
```

## Ejecución

Desde la carpeta `e2e`:

```bash
npm test            # Ejecución en segundo plano
npm run test:headed # Navegador visible, ideal para sustentación
npm run test:demo   # Navegador visible + trazas completas
npm run test:ui     # Interfaz visual para ejecutar casos individuales
npm run report      # Abre el informe HTML
```

Playwright inicia automáticamente Vite en `http://127.0.0.1:5173`.
No es necesario iniciar el backend para **estas pruebas de interfaz simuladas**.
Las APIs se interceptan en Playwright y responden con fixtures inventados.

> **Distinción académica:** estas pruebas verifican el comportamiento de la
> interfaz React y su contrato de solicitudes. **No** demuestran persistencia
> MongoDB, concurrencia real, seguridad de JWT, PayPal, entrega de correos ni
> integración de proveedores externos. Los escenarios de integración reales
> deben ejecutarse por separado contra un entorno de pruebas aislado.

## Casos automatizados

| Caso | HU | Función |
|---|---|---|
| CT-E2E-01 | HU-02 | Navegación desde inicio al login |
| CT-E2E-02 | HU-02 | Error por credenciales incorrectas |
| CT-E2E-03 | HU-02 | Inicio de sesión simulado y acceso posterior |
| CT-E2E-04 | HU-02 | Protección de rutas sin autenticación |
| CT-E2E-05 | HU-06 | Consulta y filtrado de boletos |
| CT-E2E-06 | HU-07 | Visualización del detalle del viaje |
| CT-E2E-07 | HU-06 | Recomendaciones de rutas por provincia |
| CT-E2E-08 | HU-08 | Filtro de lugares turísticos |
| CT-E2E-09 | HU-08 | Consulta turística de hoteles y atractivos |
| CT-E2E-10 | HU-09 | Presentación de recomendaciones personalizadas |
| CT-E2E-11 | HU-10 | Registro de calificación y comprobación de payload |
| CT-E2E-12 | HU-11, HU-12 | Selección de asiento y hold temporal controlado |

En este punto **ningún caso se considera aprobado sin haber ejecutado la suite**
con un navegador Playwright. Consultar únicamente el código no es una ejecución.

## Evidencia para la sustentación

- `e2e/playwright-report/index.html`: resultado de casos y detalle.
- `e2e/test-results/junit.xml`: resultado estructurado, útil para QA y CI.
- `e2e/test-results/`: capturas, videos y trazas.
- `npm run test:demo`: navegador actuando automáticamente durante la exposición.

No subas `test-results` con tokens reales o PII. Aquí se usan tokens
ficticios y un conjunto de datos de demostración.

## Próximo paso: integración real

Preparar un entorno de staging propio con `E2E_API_URL` y
`E2E_SEAT_API_URL`, usuario de pruebas y datos reiniciables. Las pruebas
actuales están preparadas para ejecutar una SPA con APIs simuladas; no se
deben ejecutar contra producción ni interpretarse como prueba del backend.

### Atención al modo live

La variable `E2E_MODE=live` cambia URLs de Vite, **pero los escenarios
actuales siguen interceptando llamadas y NO verifican el backend real**.
Para pruebas de integración deberán escribirse archivos `*.live.spec.js`
sin la función `mockApi`, con credenciales proporcionadas mediante variables
de entorno y mecanismos de limpieza.
