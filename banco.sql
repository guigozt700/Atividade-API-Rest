-- banco.sql
CREATE DATABASE IF NOT EXISTS dados;
USE dados;

CREATE TABLE IF NOT EXISTS estudante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100)
);

-- Registros iniciais
INSERT INTO estudante (nome, email) VALUES
('Bruno', 'bruno@example.com'),
('Vivian', 'vivian@example.com'),
('Marco', 'marco@example.com');

SELECT * FROM estudante;
