
  # SacredJourney

  Raj's personal pilgrimage tracker. The app records the Tirumala (Tirupati) visit completed on 6 July 2026, keeps Srisailam as the next plan, and tracks these goals:

  - 12 Jyotirlingas
  - Panch Kedar
  - Char Dham
  - Panch Kailash
  - Tirumala (Tirupati)

  ## Local development

  ```powershell
  npm ci
  npm run dev -- --host 127.0.0.1
  ```

  Run the API in another terminal with Java 25:

  ```powershell
  cd backend
  $env:JAVA_HOME = "C:\Users\Raj\.jdk\jdk-25.0.2"
  ..\apache-maven-3.9.16\bin\mvn.cmd spring-boot:run
  ```

  The frontend runs on Vite's displayed local port. The API is available at `http://127.0.0.1:8080/api/journey`.

  ## Production deployment

  The frontend and backend are merged into one Spring Boot application. The production build copies Vite's `dist` output into Spring Boot's static resources, so one process serves both the UI and API:

  ```powershell
  docker compose up --build -d
  ```

  Open `http://localhost:8080`. The API is available under the same origin at `/api/journey`, and the health check is `/api/journey/health`.

  For a local packaged build without Docker:

  ```powershell
  npm run build:full
  cd backend
  $env:JAVA_HOME = "C:\Users\Raj\.jdk\jdk-25.0.2"
  ..\apache-maven-3.9.16\bin\mvn.cmd spring-boot:run
  ```

  The local H2 database is intentionally used for this first deployable slice. Replace the datasource environment with managed MySQL settings before using persistent production data.

  ## Vercel deployment

  Vercel deploys the Vite frontend. Deploy the Spring Boot API separately to Render, Railway, Azure Container Apps, or any Docker host, then set this Vercel environment variable:

  ```text
  VITE_API_URL=https://your-sacred-journey-api.example.com
  ```

  CLI deployment:

  ```powershell
  npx vercel login
  npx vercel --prod
  ```

  In the Vercel project settings, use `VITE_API_URL` for Production, Preview, and Development as needed. The frontend build is `npm run build`, and the output directory is `dist`.
  