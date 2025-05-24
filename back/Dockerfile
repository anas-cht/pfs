# Dockerfile in /backend
# Use OpenJDK 17 as the base image
FROM openjdk:17

# Copy your built jar file into the container
COPY target/unisphere.jar app.jar

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
