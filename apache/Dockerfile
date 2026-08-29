# -------------------------
# Stage 1 - Build frontend
# -------------------------
FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY app/package*.json ./

RUN npm install --legacy-peer-deps

COPY app/ .

RUN npx expo export --platform web


# -------------------------
# Stage 2 - Apache
# -------------------------
FROM almalinux:9

RUN dnf install -y httpd mod_ssl && dnf clean all

COPY --from=frontend-build /app/dist/ /var/www/html/

COPY apache/httpd.conf /etc/httpd/conf/httpd.conf

EXPOSE 80

CMD ["httpd", "-D", "FOREGROUND"]