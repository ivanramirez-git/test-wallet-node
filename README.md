# Proyecto Prueba Interfell

## Requisitos Previos
- Docker
- Docker Compose

## Instrucciones

### 1. Clonar el Repositorio
```bash
git clone <url_del_repositorio>
cd prueba-interfell
```

### 2. Configuración de SMTP
Antes de lanzar los servicios, asegúrate de configurar las variables de entorno relacionadas con SMTP (especialmente SMTP_USER, SMTP_PASS y SMTP_FROM) en los archivos .env.docker de las carpetas wallet-soap-node y wallet-rest-node.

### 3. Levantar los Servicios
Ejecuta el siguiente comando para construir y levantar los contenedores:
```bash
docker-compose up -d --build
```

### 4. Verificar los Servicios
- **MySQL:** Puerto 3306.
- **MongoDB:** Puerto 27017.
- **Wallet Soap:** Se ejecuta en el puerto 3000.
- **Wallet Rest:** Se ejecuta en el puerto 3001.

### 5. Comandos Útiles
- Para ver logs:
```bash
docker-compose logs -f
```
- Para detener y remover los contenedores:
```bash
docker-compose down
```
