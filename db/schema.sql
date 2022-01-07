DROP TABLE IF EXISTS votes;
/*Table candidates must be dropped first because of the FK CONSTRAINT that requires the parties table to exist*/
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;


/* parties must be created before candidates because of the FK CONSTRAINT that relies on the parties table */
  CREATE TABLE parties(
 id INTEGER AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(50) NOT NULL,
 description TEXT   
);

CREATE TABLE candidates (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
party_id INTEGER,
industry_connected  BOOLEAN NOT NULL,
CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);


/*voters table*/
CREATE TABLE voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/*votes table*/
CREATE TABLE votes (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  voter_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uc_voter UNIQUE (voter_id),
  CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
  CONSTRAINT fK_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE

);

