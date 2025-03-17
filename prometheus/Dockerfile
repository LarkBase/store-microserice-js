# Use the official Prometheus image
FROM prom/prometheus:v2.50.1

# Set working directory
WORKDIR /etc/prometheus

# Copy configuration file into the container
COPY prometheus.yml /etc/prometheus/prometheus.yml 
COPY alert_rules.yml /etc/prometheus/alert_rules.yml 

# Expose Prometheus default port
EXPOSE 9090

# Start Prometheus (entrypoint is already defined in the base image)
