FROM node:22-alpine AS frontend-build
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM maven:3.9.16-eclipse-temurin-25 AS backend-build
WORKDIR /workspace
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
COPY --from=frontend-build /workspace/dist backend/src/main/resources/static
RUN mvn -q -f backend/pom.xml -DskipTests package

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=backend-build /workspace/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC"
HEALTHCHECK --interval=30s --timeout=5s CMD wget -q -O - http://localhost:8080/api/journey/health || exit 1
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
