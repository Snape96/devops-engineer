# CNC GPT
## _API + Admin Panel (Strapi - Node.js)_
### Requirements
- Docker
- Database (assuming MySQL 8, [other compatible](https://docs.strapi.io/dev-docs/installation/cli#preparing-the-installation))

### Steps
1. Initiate database and create empty schema named "strapi" (or other name, see .env configuration)
2. Configure environment to reflect database configuration
```
DATABASE_CLIENT=mysql
DATABASE_CLIENT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_PORT=
```
3. If needed, configure other environment variables, like DATABASE_SSL. For complete list, see [documentation](https://docs.strapi.io/dev-docs/configurations/database#environment-variables-in-database-configurations).
4. Build docker container for test or production
```
docker build -t cnc-gpt-strapi -f Dockerfile .
```
```
docker build -t cnc-gpt-strapi -f Dockerfile.prod .
```
5. Either map to default strapi port (1337), or change it in .env
6. Access {api_url}/admin and create first user. This user will act as superadmin user, who can then create other users.

## _Frontend (Next.js)_
1. Configure .env file
```
OPENAI_API_KEY={open ai api key for gpt}
GOOGLE_ID={id to google auth app}
GOOGLE_SECRET={secret to google auth}
NEXTAUTH_URL={url to site}
NEXTAUTH_SECRET={can be generated from this url: https://generate-secret.vercel.app/32}
STRAPI_URL={url.to.api.com/graphql}
```
2. For all env variables, also create their client counterparts (by adding NEXT_PUBLIC_ prefix)
3. Build with following commands
```
yarn
```
```
yarn build
```
```
yarn start
```