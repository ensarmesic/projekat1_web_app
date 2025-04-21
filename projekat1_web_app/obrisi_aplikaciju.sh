#!/bin/bash
echo "[INFO] Brisanje kontejnera, volumena i mreže..."
docker compose down --volumes --rmi all --remove-orphans
