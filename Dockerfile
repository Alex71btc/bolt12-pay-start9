FROM python:3.11-slim

USER root

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    ca-certificates \
    bash \
    build-essential \
    automake \
    pkg-config \
    libtool \
    libffi-dev \
    libgmp-dev \
    && rm -rf /var/lib/apt/lists/*

COPY upstream/ /app/
COPY docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY scripts/start.sh /usr/local/bin/start.sh
COPY scripts/healthcheck.sh /usr/local/bin/healthcheck.sh

# optional if you want lndk-cli in web image later
# COPY lndk-bin/lndk-cli /usr/local/bin/lndk-cli

RUN chmod +x /usr/local/bin/docker_entrypoint.sh /usr/local/bin/start.sh /usr/local/bin/healthcheck.sh

RUN if [ -f /app/requirements.txt ]; then pip install --no-cache-dir -r /app/requirements.txt; fi

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
