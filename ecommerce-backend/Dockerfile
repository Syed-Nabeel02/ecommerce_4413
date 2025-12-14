# Build stage (JDK 24)
FROM maven:3.9-eclipse-temurin-24 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests clean package

# Run stage (JRE 24)
FROM eclipse-temurin:24-jre
WORKDIR /app
COPY --from=build /app/target/ecommerce-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]