
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

  Photos are stored by the API in its database, so every device using the same API sees the same albums. The default H2 database is file-backed, and Docker Compose mounts a persistent volume at `/app/data`; photos remain available after app/container restarts. Keep the `sacred-journey-data` volume when updating the container.

  ### Render backend

  The root `render.yaml` defines the Docker API service and its persistent disk. In Render, create a new Blueprint from this repository and review the service and disk costs before confirming; the persistent disk requires a paid service plan. After deployment, copy the service URL into the Vercel `VITE_API_URL` environment variable and redeploy the frontend.

  ## Vercel deployment

  Vercel deploys only the Vite frontend and does not provide persistent storage for the API. Deploy the Spring Boot API separately to Render, Railway, Azure Container Apps, or another host, and configure that API to use a persistent database. For example, set `DB_URL`, `DB_DRIVER`, `DB_USERNAME`, and `DB_PASSWORD` on the API host for a managed MySQL instance. Do not rely on the default file-backed H2 database on hosts with ephemeral filesystems.

  Set this Vercel environment variable to the deployed API's base URL:

  ```text
  VITE_API_URL=https://your-sacred-journey-api.example.com
  ```

  CLI deployment:

  ```powershell
  npx vercel login
  npx vercel --prod
  ```

  In the Vercel project settings, use `VITE_API_URL` for Production, Preview, and Development as needed. The frontend build is `npm run build`, and the output directory is `dist`. Existing photos saved only in a browser's local storage are uploaded to the API the first time that browser opens the updated app; keep that browser's saved data until migration completes.
  