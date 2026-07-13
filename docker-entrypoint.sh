#!/bin/sh
set -e

echo "Veritabanı migration'ları uygulanıyor..."
npx prisma migrate deploy

exec "$@"
