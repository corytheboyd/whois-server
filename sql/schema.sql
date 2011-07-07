CREATE TABLE records (
  id INTEGER not null AUTO_INCREMENT not null,
  domain varchar(255) not null,
  record varchar(255) not null,
  PRIMARY KEY (id),
  UNIQUE KEY `idx_domain` (domain(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
