# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln ./
COPY server/API/*.csproj ./server/API/
COPY server/DataAccess/*.csproj ./server/DataAccess/
COPY server/Service/*.csproj ./server/Service/
COPY server/BBVenturesTests/*.csproj ./server/BBVenturesTests/
RUN dotnet restore

# copy everything else and build app
COPY server/API/. ./server/API/
COPY server/DataAccess/. ./server/DataAccess/
COPY server/Service/. ./server/Service/
COPY server/BBVenturesTests/. ./server/BBVenturesTests/
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "API.dll"]