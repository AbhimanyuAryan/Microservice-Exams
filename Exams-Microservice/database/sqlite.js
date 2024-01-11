const sqlite3 = require("sqlite3").verbose();

const DB_SOURCE = "db.sqlite";

let db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        throw err;
    } else {

        /** exams {
            id integer,
            name text,
            duration integer,
            backspace integer,
            active integer (bool 0, 1)
        }

        exams_professors {
            id_exam integer,
            id_professor integer
        }

        questions {
            id integer,
            type integer,
            description text,
            active integer (bool 0, 1)
        }

        questions_options {
            option_id integer,
            question_id integer,
            description text,
            correct integer (bool 0, 1)
        }

        exams_questions {
            exam_id integer,
            question_id integer
        }

        published_exams {
            id integer,
            exam_id integer,
            date text,
            versions integer,
            max_questions integer
        }

        published_exams_students {
            id_published_exam integer,
            id_student integer
        }

        published_exams_versions {
            id_published_exam integer,
            id_version integer
        }

        published_exams_versions_questions {
            id_published_exam integer,
            id_version integer,
            id_question integer
        }
        */

        const DATABASE_CREATION_QUERY = `
            CREATE TABLE exams (
                id integer PRIMARY KEY AUTOINCREMENT, 
                name text, 
                duration integer, 
                backspace integer,
                active integer
            );

            CREATE TABLE exams_professors(
                id_exam integer, 
                id_professor integer, 
                FOREIGN KEY(id_exam) REFERENCES exams(id), 
                FOREIGN KEY(id_professor) REFERENCES professors(id)
            );

            CREATE TABLE questions(
                id integer PRIMARY KEY AUTOINCREMENT, 
                type integer, 
                description text, 
                active bool
            );

            CREATE TABLE questions_options(
                option_id integer PRIMARY KEY AUTOINCREMENT,
                question_id integer, 
                description text, 
                correct bool,
                FOREIGN KEY(question_id) REFERENCES questions(id)
            );

            CREATE TABLE exams_questions(
                exam_id integer, 
                question_id integer, 
                FOREIGN KEY(exam_id) REFERENCES exams(id), 
                FOREIGN KEY(question_id) REFERENCES questions(id)
            );

            CREATE TABLE published_exams(
                id integer PRIMARY KEY AUTOINCREMENT, 
                exam_id integer, 
                date text, 
                versions integer, 
                max_questions integer, 
                FOREIGN KEY(exam_id) REFERENCES exams(id)
            );

            CREATE TABLE published_exams_students(
                id_published_exam integer, 
                id_student integer, 
                FOREIGN KEY(id_published_exam) REFERENCES published_exams(id)
            );

            CREATE TABLE published_exams_versions(
                id_published_exam integer, 
                id_version integer, 
                FOREIGN KEY(id_published_exam) REFERENCES published_exams(id)
            );

            CREATE TABLE published_exams_versions_questions(
                id_published_exam integer, 
                id_version integer, 
                id_question integer, 
                FOREIGN KEY(id_published_exam) REFERENCES published_exams(id), 
                FOREIGN KEY(id_version) REFERENCES published_exams_versions(id), 
                FOREIGN KEY(id_question) REFERENCES questions(id)
            );
        `;
        db.exec(
            DATABASE_CREATION_QUERY,
            (err) => {
                if (err) {
                    console.log("SQLITE: Database already exists.");
                } else {
                    console.log("SQLITE: Created database.");
                }
            }
        );
    }
});

module.exports = db;
