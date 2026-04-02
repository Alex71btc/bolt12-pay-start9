FROM alex71btc/lndk:start9-20260402 AS lndkstage

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

# copy requirements first so pip install stays cached
COPY upstream/requirements.txt /app/requirements.txt

RUN if [ -f /app/requirements.txt ]; then \
      pip install --no-cache-dir -r /app/requirements.txt; \
    fi

# then copy the rest of the application
COPY upstream/ /app/
COPY docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY scripts/start.sh /usr/local/bin/start.sh
COPY scripts/healthcheck.sh /usr/local/bin/healthcheck.sh

COPY --from=lndkstage /usr/local/bin/lndk /usr/local/bin/lndk
COPY --from=lndkstage /usr/local/bin/lndk-cli /usr/local/bin/lndk-cli

RUN chmod +x \
    /usr/local/bin/docker_entrypoint.sh \
    /usr/local/bin/start.sh \
    /usr/local/bin/healthcheck.sh \
    /usr/local/bin/lndk \
    /usr/local/bin/lndk-cli

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
