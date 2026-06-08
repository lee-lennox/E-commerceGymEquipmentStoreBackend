# Start from an OpenJDK image
FROM eclipse-temurin:21-jdk-jammy

# Set environment variables for PostgreSQL
ENV DATABASE_URL=jdbc:postgresql://localhost:5432/gymstore
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=Postgres
ENV SPRING_WEB_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://lennoxgymstore1.netlify.app
ENV FRONTEND_URL=http://localhost:5173,http://localhost:3000,https://lennoxgymstore1.netlify.app

# SMTP placeholders (override at runtime with secure secrets)
ENV SPRING_MAIL_HOST=smtp.example.com
ENV SPRING_MAIL_PORT=587
ENV SPRING_MAIL_USERNAME=your-smtp-username
ENV SPRING_MAIL_PASSWORD=your-smtp-password
ENV SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
ENV SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true

# Set the working directory inside the container
WORKDIR /app

# Copy uploads (product images) into the container so the app can serve them
# If you prefer mounting a volume at runtime, you can skip copying uploads into image.
COPY uploads/ uploads/

# Copy Maven build artifact into the container
COPY target/ecommerce-gym-backend-1.0-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Command to run the JAR
ENTRYPOINT ["java","-jar","app.jar"]