FROM node:20-alpine

WORKDIR /app

# Copy repository files
COPY . .

# Install CLI dependencies
RUN cd cli && npm ci || (cd cli && npm install)

# Start PCP MCP Server on stdio
ENTRYPOINT ["node", "cli/bin/pcp.js", "mcp"]
