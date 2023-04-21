-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 21-Abr-2023 às 02:46
-- Versão do servidor: 10.4.24-MariaDB
-- versão do PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `frontendeiros`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `articles`
--

CREATE TABLE `articles` (
  `art_id` int(11) NOT NULL,
  `art_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `art_author` int(11) NOT NULL,
  `art_title` varchar(127) NOT NULL,
  `art_thumbnail` varchar(255) DEFAULT NULL COMMENT 'URL da imagem.',
  `art_resume` varchar(127) NOT NULL,
  `art_content` text NOT NULL,
  `art_views` int(11) DEFAULT 0,
  `art_status` enum('on','off','del') DEFAULT 'on'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `articles`
--

INSERT INTO `articles` (`art_id`, `art_date`, `art_author`, `art_title`, `art_thumbnail`, `art_resume`, `art_content`, `art_views`, `art_status`) VALUES
(1, '2023-04-21 00:35:49', 1, 'Primeiro artigo da parada', 'https://picsum.photos/200', 'Este é o primeiro artigo do nosso blog.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a ultrices leo. Vivamus in suscipit quam. Sed posuere erat non massa vehicula laoreet.', 0, 'on'),
(2, '2023-04-21 00:39:15', 1, 'Segundo artigo da parada', 'https://picsum.photos/201', 'Este é o segundo artigo do nosso blog.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a ultrices leo. Vivamus in suscipit quam. Sed posuere erat non massa vehicula laoreet.', 0, 'on'),
(3, '2023-04-21 00:43:34', 2, 'Segundo artigo do Blog', 'https://picsum.photos/203', 'Este é o segundo artigo do nosso blog.', 'Vamos escrever essa bagaça.', 0, 'on'),
(4, '2023-04-21 00:43:34', 3, 'Segundo artigo do Blog', 'https://picsum.photos/204', 'Este é o terceiro artigo do nosso blog.', 'Vamos novamente escrever essa bagaça.', 0, 'on');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`art_id`),
  ADD KEY `art_author` (`art_author`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `articles`
--
ALTER TABLE `articles`
  MODIFY `art_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`art_author`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
