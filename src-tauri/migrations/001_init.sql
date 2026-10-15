CREATE TABLE IF NOT EXISTS courts (
	id			INTEGER PRIMARY KEY,
	parent_id	INTEGER REFERENCES courts(id),
	name		TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cases (
	id 					INTEGER PRIMARY KEY,
	court_id			INTEGER NOT NULL REFERENCES courts(id),
	case_type			TEXT NOT NULL,
	case_number			TEXT NOT NULL,
	case_name			TEXT NOT NULL,
	filed_at			TEXT NOT NULL,
	plaintiff			TEXT NOT NULL,
	plaintiff_lawyer	TEXT,
	defendant			TEXT NOT NULL,
	defendant_lawyer	TEXT,
	created_at			TEXT DEFAULT CURRENT_TIMESTAMP,
	updated_at			TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hearings (
	id 								INTEGER PRIMARY KEY,
	case_id							INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
	hearing_date					TEXT NOT NULL,
	hearing_time					TEXT NOT NULL,
	plaintiff_attended				BOOLEAN,
	plaintiff_not_attended			BOOLEAN,
	defendant_attended				BOOLEAN,
	defendant_not_attended			BOOLEAN,
	plaintiff_lawyer_attended		BOOLEAN,
	plaintiff_lawyer_not_attended	BOOLEAN,
	defendant_lawyer_attended		BOOLEAN,
	defendant_lawyer_not_attended	BOOLEAN,
	created_at						TEXT DEFAULT CURRENT_TIMESTAMP,
	updated_at						TEXT DEFAULT CURRENT_TIMESTAMP		
);

CREATE TABLE IF NOT EXISTS memos (
	id 					INTEGER PRIMARY KEY,
	case_id				INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
	section_type		TEXT NOT NULL,
	hearing_id			INTEGER REFERENCES hearings(id) ON DELETE CASCADE,
	contents			TEXT,
	created_at			TEXT DEFAULT CURRENT_TIMESTAMP,
	updated_at			TEXT DEFAULT CURRENT_TIMESTAMP
);