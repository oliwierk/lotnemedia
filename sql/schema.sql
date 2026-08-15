CREATE TABLE IF NOT EXISTS portfolio_items (
  id VARCHAR(64) PRIMARY KEY,
  type ENUM('video','photo') NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  youtube_id VARCHAR(32),
  bg VARCHAR(16) NOT NULL,
  thumbnail VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS site_content (
  id TINYINT PRIMARY KEY DEFAULT 1,
  bio_short TEXT,
  bio_full TEXT,
  awards JSON,
  texts JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
