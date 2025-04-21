#!/bin/bash
echo "[INFO] Pokretanje aplikacije..."
docker compose up -d --remove-orphans --build
echo "[INFO] Aplikacija dostupna na http://localhost:3000"
