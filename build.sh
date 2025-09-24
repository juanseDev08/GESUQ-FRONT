#!/bin/bash

# Instalar dependencias
npm install

# Construir la aplicación para producción
npm run build --prod

echo "Build completado exitosamente"
