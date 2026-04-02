FROM alex71btc/bolt12-pay:0.2.74

USER root

COPY docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY scripts/start.sh /usr/local/bin/start.sh
COPY scripts/healthcheck.sh /usr/local/bin/healthcheck.sh
RUN chmod +x /usr/local/bin/docker_entrypoint.sh /usr/local/bin/start.sh /usr/local/bin/healthcheck.sh

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
