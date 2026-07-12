FROM alex71btc/lndk:v0.3.0-memo@sha256:460fba9927e96cf24d5b96122638afc0b11f433cb8e74d1735fe4570fb005b4e AS lndkstage

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

# The upstream app lives in the app/ subdir of the lndk-pay monorepo (pinned
# as the ./upstream submodule). Copy requirements first so pip install stays cached.
COPY upstream/app/requirements.txt /app/requirements.txt

RUN if [ -f /app/requirements.txt ]; then \
      pip install --no-cache-dir -r /app/requirements.txt; \
    fi

# then copy the rest of the application
COPY upstream/app/ /app/
COPY assets/docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY assets/start.sh /usr/local/bin/start.sh

COPY --from=lndkstage /usr/local/bin/lndk /usr/local/bin/lndk
COPY --from=lndkstage /usr/local/bin/lndk-cli /usr/local/bin/lndk-cli

RUN chmod +x \
    /usr/local/bin/docker_entrypoint.sh \
    /usr/local/bin/start.sh \
    /usr/local/bin/lndk \
    /usr/local/bin/lndk-cli

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
