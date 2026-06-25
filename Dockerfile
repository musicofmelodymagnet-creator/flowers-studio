FROM php:8.3-apache

# Enable mod_rewrite for clean URLs and .htaccess support
RUN a2enmod rewrite

# Copy site files
COPY . /var/www/html/

# Remove local dev and secrets files from the image
RUN rm -f /var/www/html/.env \
         /var/www/html/.env.example \
         /var/www/html/docker-compose.yml \
         /var/www/html/Dockerfile

# Correct ownership
RUN chown -R www-data:www-data /var/www/html

# Apache: allow .htaccess overrides in the document root
RUN sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/apache2.conf

EXPOSE 80
