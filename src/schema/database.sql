
-- MySQL Schema for Marky Tickets Application

-- Destinations Table
CREATE TABLE destinations (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  price_value DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  distance VARCHAR(100),
  travel_time VARCHAR(100)
);

-- Reviews Table
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  destination_id VARCHAR(36) NOT NULL,
  author VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  rating INT NOT NULL,
  date DATETIME NOT NULL,
  author_avatar VARCHAR(255),
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- Tickets Table
CREATE TABLE tickets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  travel_date DATE NOT NULL,
  travel_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('unused', 'used', 'expired') NOT NULL DEFAULT 'unused',
  qr_code TEXT,
  issued DATETIME NOT NULL,
  INDEX (user_id),
  INDEX (status)
);

-- Ticket Stops (for multi-stop journeys)
CREATE TABLE ticket_stops (
  id VARCHAR(36) PRIMARY KEY,
  ticket_id VARCHAR(36) NOT NULL,
  stop_name VARCHAR(255) NOT NULL,
  stop_order INT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Users/Profiles Table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  phone VARCHAR(50),
  preferred_payment VARCHAR(100),
  notifications BOOLEAN DEFAULT TRUE,
  points INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (email)
);

-- User Favorites (Many-to-Many relationship between users and destinations)
CREATE TABLE user_favorites (
  user_id VARCHAR(36) NOT NULL,
  destination_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (user_id, destination_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- Promotions Table
CREATE TABLE promotions (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount DECIMAL(5,2) NOT NULL,
  description TEXT NOT NULL,
  expiry_date DATETIME NOT NULL,
  minimum_purchase DECIMAL(10,2),
  active BOOLEAN DEFAULT TRUE,
  INDEX (code),
  INDEX (active, expiry_date)
);

-- Notifications Table
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id, is_read)
);

-- For storing authentication sessions
CREATE TABLE user_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (token),
  INDEX (expires_at)
);

-- For storing payment information
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  ticket_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL,
  transaction_id VARCHAR(255),
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id),
  INDEX (status)
);
