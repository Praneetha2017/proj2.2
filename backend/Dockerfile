FROM maven:3.9.0-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/itihasyatra-backend-0.0.1-SNAPSHOT.jar ./itihasyatra-backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "./itihasyatra-backend.jar"]
