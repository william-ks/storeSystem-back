CREATE DATABASE store;

DROP TABLE IF EXISTS sales;

DROP TABLE IF EXISTS tickets;

DROP TABLE IF EXISTS providers;

DROP TABLE IF EXISTS clients;

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS store (
    id SERIAL PRIMARY KEY,
    name TEXT,
    cnpj TEXT,
    cel TEXT
);

CREATE TABLE IF NOT EXISTS offices (
    id SERIAL PRIMARY KEY,
    level INTEGER NOT NULL,
    office TEXT NOT NULL
);

INSERT INTO
    offices (level, office)
VALUES
    (1, 'dev'),
    (2, 'Admin'),
    (3, 'Colaborador');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    office TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    "orderDate" TEXT,
    "orderFrequency" TEXT,
    "deliveryDate" TEXT,
    "extraInfos" text,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    value INTEGER NOT NULL,
    provider_id INTEGER REFERENCES providers(id),
    "dueDate" DATE NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT FALSE,
    "isDeleted" boolean default FALSE
);

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL,
    email TEXT,
    credit INT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name NOT NULL,
    inventory INTEGER NOT NULL,
    provider_id INTEGER REFERENCES providers(id),
    "isDeleted" boolean default False
);

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    "saleNumber" INTEGER NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    "isCredit" BOOLEAN NOT NULL DEFAULT FALSE,
    client_id INTEGER REFERENCES clients(id),
    "isPaid" BOOLEAN NOT NULL DEFAULT TRUE,
    "isDeleted" boolean default False
);