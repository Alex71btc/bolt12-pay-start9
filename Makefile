PKG_ID=boltpay
PKG_VERSION=0.2.74.0

PLATFORM ?= linux/arm64

all: pack

scripts/embassy.js: scripts/embassy.ts
	cp scripts/embassy.ts scripts/embassy.js

image.tar: Dockerfile docker_entrypoint.sh scripts/start.sh scripts/healthcheck.sh scripts/embassy.ts
	docker buildx build \
		--platform=$(PLATFORM) \
		--tag start9/$(PKG_ID)/main:$(PKG_VERSION) \
		-o type=docker,dest=image.tar \
		.

pack: scripts/embassy.js image.tar
	start-sdk pack

verify: pack
	start-sdk verify s9pk $(PKG_ID).s9pk

clean:
	rm -f image.tar scripts/embassy.js $(PKG_ID).s9pk
