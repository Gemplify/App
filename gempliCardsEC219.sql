-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:8889
-- Tiempo de generación: 24-05-2021 a las 15:39:59
-- Versión del servidor: 5.6.38
-- Versión de PHP: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gempliCardsEC219`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `block`
--

CREATE TABLE `block` (
  `id` int(11) NOT NULL,
  `text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `status` int(11) NOT NULL DEFAULT '1',
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `block_rel_deck`
--

CREATE TABLE `block_rel_deck` (
  `id` int(11) NOT NULL,
  `block_id` int(11) NOT NULL,
  `version_id` int(11) NOT NULL,
  `deck_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `blockreldeck_id` int(11) NOT NULL,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `zIndex` int(3) NOT NULL DEFAULT '1',
  `type` int(2) NOT NULL,
  `status` int(1) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deck`
--

CREATE TABLE `deck` (
  `id` int(11) NOT NULL,
  `text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `relation`
--

CREATE TABLE `relation` (
  `id` int(11) NOT NULL,
  `version_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(2) NOT NULL,
  `status` int(2) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `relation_card`
--

CREATE TABLE `relation_card` (
  `id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `relation_id` int(11) NOT NULL,
  `type` int(2) NOT NULL,
  `status` int(2) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `version_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `share` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiration` datetime DEFAULT NULL,
  `type` int(2) NOT NULL,
  `status` int(2) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `session_rel`
--

CREATE TABLE `session_rel` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `card_id` int(11) DEFAULT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci,
  `config_card` text COLLATE utf8mb4_unicode_ci,
  `type` int(2) NOT NULL,
  `status` int(2) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `type` int(2) NOT NULL COMMENT '0-admin, 1-user',
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `version`
--

CREATE TABLE `version` (
  `id` int(11) NOT NULL,
  `block_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `status` int(11) NOT NULL DEFAULT '1',
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `block`
--
ALTER TABLE `block`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `block` ADD FULLTEXT KEY `text` (`text`);

--
-- Indices de la tabla `block_rel_deck`
--
ALTER TABLE `block_rel_deck`
  ADD PRIMARY KEY (`id`),
  ADD KEY `block_id` (`block_id`),
  ADD KEY `reld_id` (`deck_id`),
  ADD KEY `version_id` (`version_id`);

--
-- Indices de la tabla `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blockreldeck_id` (`blockreldeck_id`);

--
-- Indices de la tabla `deck`
--
ALTER TABLE `deck`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `relation`
--
ALTER TABLE `relation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `version_id` (`version_id`);

--
-- Indices de la tabla `relation_card`
--
ALTER TABLE `relation_card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `card_id` (`card_id`),
  ADD KEY `relation_id` (`relation_id`);

--
-- Indices de la tabla `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `version_id` (`version_id`);
ALTER TABLE `session` ADD FULLTEXT KEY `name` (`name`);

--
-- Indices de la tabla `session_rel`
--
ALTER TABLE `session_rel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `card_id` (`card_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `version`
--
ALTER TABLE `version`
  ADD PRIMARY KEY (`id`),
  ADD KEY `block_id` (`block_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `block`
--
ALTER TABLE `block`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `block_rel_deck`
--
ALTER TABLE `block_rel_deck`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT de la tabla `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT de la tabla `deck`
--
ALTER TABLE `deck`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `relation`
--
ALTER TABLE `relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `relation_card`
--
ALTER TABLE `relation_card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `session_rel`
--
ALTER TABLE `session_rel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `version`
--
ALTER TABLE `version`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `block_rel_deck`
--
ALTER TABLE `block_rel_deck`
  ADD CONSTRAINT `block_rel_deck_ibfk_1` FOREIGN KEY (`block_id`) REFERENCES `block` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `block_rel_deck_ibfk_2` FOREIGN KEY (`deck_id`) REFERENCES `deck` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `block_rel_deck_ibfk_3` FOREIGN KEY (`version_id`) REFERENCES `version` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `card_ibfk_1` FOREIGN KEY (`blockreldeck_id`) REFERENCES `block_rel_deck` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `relation`
--
ALTER TABLE `relation`
  ADD CONSTRAINT `relation_ibfk_1` FOREIGN KEY (`version_id`) REFERENCES `version` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `relation_card`
--
ALTER TABLE `relation_card`
  ADD CONSTRAINT `relation_card_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `relation_card_ibfk_2` FOREIGN KEY (`relation_id`) REFERENCES `relation` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `session_ibfk_1` FOREIGN KEY (`version_id`) REFERENCES `version` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `session_rel`
--
ALTER TABLE `session_rel`
  ADD CONSTRAINT `session_rel_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `session_rel_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `version`
--
ALTER TABLE `version`
  ADD CONSTRAINT `version_ibfk_1` FOREIGN KEY (`block_id`) REFERENCES `block` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
