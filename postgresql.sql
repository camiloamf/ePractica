-- Creación de la base de datos
CREATE DATABASE olDB;

-- Script 1: Creación de las tablas y relaciones

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(150) NOT NULL, -- Nombre
    email VARCHAR(255) UNIQUE NOT NULL, -- Correo
    password VARCHAR(255) NOT NULL, -- Contraseña
    rol VARCHAR(50) CHECK (rol IN ('Administrador', 'Auxiliar de Registro')) NOT NULL, -- Rol
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualización
);

CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL, -- Razón social
    city VARCHAR(100) NOT NULL, -- Municipio
    phone VARCHAR(15), -- Teléfono
    email VARCHAR(150), -- Correo
    state BOOLEAN DEFAULT TRUE NOT NULL, -- Estado: TRUE = Activo, FALSE = Inactivo
    auditor_user INT NOT NULL REFERENCES users (id), -- Auditor
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Fecha de registro
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualizacion
);

CREATE TABLE establishments (
    id SERIAL PRIMARY KEY,
    establishment_name VARCHAR(150) NOT NULL, -- Nombre del establecimiento
    income DECIMAL(15, 2) NOT NULL, -- Ingresos
    employees_number INT NOT NULL, -- Número de empleados
    merchant_id INT NOT NULL REFERENCES merchants (id) ON DELETE CASCADE, -- Id del comerciante dueño
    auditor_user INT NOT NULL REFERENCES users (id), -- Auditor
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualización
);

-- Script 2: Creación de índices

-- Índice en la tabla de usuarios
CREATE INDEX idx_users_email ON users (email);

-- Índices en la tabla de comerciantes
CREATE INDEX idx_merchants_company_name ON merchants (company_name);
CREATE INDEX idx_merchants_city ON merchants (city);
CREATE INDEX idx_merchants_state ON merchants (state);

-- Índices en la tabla de establecimientos
CREATE INDEX idx_establishments_name ON establishments (establishment_name);
CREATE INDEX idx_establishments_merchant_id ON establishments (merchant_id);

-- Script 3: Función para manejar auditoría

CREATE OR REPLACE FUNCTION update_audit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    IF NEW.auditor_user IS NULL THEN
        RAISE EXCEPTION 'El campo auditor_user no puede ser NULL';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para auditoría
CREATE TRIGGER trg_audit_merchants
BEFORE INSERT OR UPDATE ON merchants
FOR EACH ROW
EXECUTE FUNCTION update_audit();

CREATE TRIGGER trg_audit_establishments
BEFORE INSERT OR UPDATE ON establishments
FOR EACH ROW
EXECUTE FUNCTION update_audit();

-- Script 4: Inserción de datos semilla

-- Insertar usuarios
INSERT INTO users (name, email, password, rol) VALUES
('Admin General', 'admin@olsoftware.com', 'admin123', 'Administrador'),
('Auxiliar 1', 'auxiliar1@olsoftware.com', 'aux123', 'Auxiliar de Registro');

-- Insertar comerciantes
INSERT INTO merchants (company_name, city, phone, email, state, auditor_user) VALUES
('Comerciante 1', 'Bogotá', '3001234567', 'comer1@example.com', TRUE, 1),
('Comerciante 2', 'Cali', NULL, 'comer2@example.com', TRUE, 1),
('Comerciante 3', 'Medellín', '3017654321', NULL, FALSE, 2),
('Comerciante 4', 'Cartagena', '3008765432', 'comer4@example.com', TRUE, 1),
('Comerciante 5', 'Barranquilla', NULL, NULL, FALSE, 2);

-- Insertar establecimientos
INSERT INTO establishments (establishment_name, income, employees_number, merchant_id, auditor_user) VALUES
('Tienda A', 10000.50, 5, 1, 1),
('Tienda B', 15000.75, 8, 1, 1),
('Tienda C', 8000.00, 3, 2, 2),
('Tienda D', 20000.20, 12, 3, 1),
('Tienda E', 12000.00, 6, 4, 1),
('Tienda F', 25000.99, 10, 4, 2),
('Tienda G', 30000.10, 15, 5, 2),
('Tienda H', 11000.00, 4, 5, 1),
('Tienda I', 9000.00, 7, 3, 2),
('Tienda J', 5000.50, 2, 2, 1);