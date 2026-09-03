CREATE TABLE IF NOT EXISTS cases (
	id 					INTEGER PRIMARY KEY,
	court_name			TEXT NOT NULL,
	case_number			TEXT NOT NULL,
	case_name			TEXT NOT NULL,
	plaintiff			TEXT NOT NULL,
	defendant			TEXT NOT NULL,
	plaintiff_lawyer	TEXT,
	defendant_lawyer	TEXT,
	created_at			TEXT DEFAULT CURRENT_TIMESTAMP,
	updated_at			TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hearings (
	id 							INTEGER PRIMARY KEY,
	case_id						INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
	hearing_date				TEXT NOT NULL,
	hearing_time				TEXT NOT NULL,
	plaintiff_attended			BOOLEAN NOT NULL,
	defendant_attended			BOOLEAN NOT NULL,
	plaintiff_lawyer_attended	BOOLEAN NOT NULL,
	defendant_lawyer_attended	BOOLEAN NOT NULL,
	created_at					TEXT DEFAULT CURRENT_TIMESTAMP,
	updated_at					TEXT DEFAULT CURRENT_TIMESTAMP		
);

CREATE TABLE IF NOT EXISTS memos (
	id 					INTEGER PRIMARY KEY,
	case_id				INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
	section_type		TEXT NOT NULL,
	hearing_id			INTEGER REFERENCES hearings(id) ON DELETE CASCADE,
	content				TEXT,
	created_at			TEXT DEFAULT CURRENT_TIMESTAMP,
	updated_at			TEXT DEFAULT CURRENT_TIMESTAMP
);