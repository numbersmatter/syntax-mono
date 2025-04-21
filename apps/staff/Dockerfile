# syntax=docker/dockerfile:1

# Base stage
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@latest-10

# Development build stage
FROM base AS devbuild
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
RUN pnpm -F staff run build

# Final production stage
FROM node:22-alpine AS final
WORKDIR /app

ENV NODE_ENV=production
# Install pnpm globally if needed for the start command
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@latest-10

# Copy necessary package manifests and lockfile from the build stage
COPY --from=devbuild /app/package.json ./package.json
COPY --from=devbuild /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=devbuild /app/apps/staff/package.json ./apps/staff/package.json
# Copy .npmrc if it exists and is needed
# COPY --from=devbuild /app/.npmrc ./.npmrc

# Install only production dependencies for the 'staff' app
# Use cache mount for potentially faster installs
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --filter staff

# Copy the built application code from the devbuild stage
# Corrected path: /app/apps/staff/build/ instead of /app/appout/
COPY --from=devbuild /app/apps/staff/build ./apps/staff/build

# Set the working directory to the app's context
WORKDIR /app/apps/staff

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Run the application using the start script defined in apps/staff/package.json
CMD ["pnpm", "start"]