const getExams = (db) => {
    const queryExams = `SELECT * FROM exams WHERE active <> 0;`;

    return new Promise((resolve, reject) => {
        db.all(queryExams, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const getExamsIdFromTeacherId = (db, teacher_id) => {
    const queryExamsProfessors = `SELECT * FROM exams_professors WHERE id_professor = ?;`;
    const valuesExamsProfessors = [teacher_id];

    return new Promise((resolve, reject) => {
        db.all(queryExamsProfessors, valuesExamsProfessors, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const createExam = async (db, exam, teacher_id) => {
    return new Promise((resolve, reject) => {
        const queryExams = `INSERT INTO exams (name, duration, backspace, active) VALUES (?, ?, ?, ?)`;
        const valuesExams = [exam.name, exam.duration, exam.backspace, 1];

        db.run(queryExams, valuesExams, function (err) {
            if (err) resolve("Error creating exam.");
            else {
                const queryExamsProfessors = `INSERT INTO exams_professors (id_exam, id_professor) VALUES (?, ?)`;
                const valuesExamsProfessors = [this.lastID, teacher_id];

                db.run(queryExamsProfessors, valuesExamsProfessors, (err) => {
                    if (err) {
                        const queryExams = `DELETE FROM exams WHERE id = ?`;
                        const valuesExams = [this.lastID];
                        db.run(queryExams, valuesExams);

                        resolve("Error creating exam.");
                    } else resolve(true)
                });
            }
        });
    });
}

const checkIfExamExistsByName = (db, exam_name) => {
    const queryExams = `SELECT * FROM exams WHERE name = ? AND active = 1`;
    const valuesExams = [exam_name];

    return new Promise((resolve, reject) => {
        db.get(queryExams, valuesExams, (err, row) => {
            if (err) reject(err);
            else {
                if (row) resolve(true);
                else resolve(false);
            }
        });
    });
}

const checkIfExamExistsById = (db, exam_id) => {
    const queryExams = `SELECT * FROM exams WHERE id = ? AND active = 1`;
    const valuesExams = [exam_id];

    return new Promise((resolve, reject) => {
        db.get(queryExams, valuesExams, (err, row) => {
            if (err) reject(err);
            else {
                if (row) resolve(true);
                else resolve(false);
            }
        });
    });
}

const deleteExam = (db, exam_id) => {
    const queryExams = `UPDATE exams SET active = 0 WHERE id = ?`;
    const valuesExams = [exam_id];

    return new Promise((resolve, reject) => {
        db.run(queryExams, valuesExams, (err) => {
            if (err) resolve(false);
            else resolve(true);
        });
    });
}

const getExamOwners = (db, exam_id) => {
    const queryExams = `SELECT * FROM exams_professors WHERE id_exam = ?`;
    const valuesExams = [exam_id];

    return new Promise((resolve, reject) => {
        db.all(queryExams, valuesExams, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const addExamOwner = (db, exam_id, professor_id) => {
    const queryExams = `INSERT INTO exams_professors (id_exam, id_professor) VALUES (?, ?)`;
    const valuesExams = [exam_id, professor_id];

    return new Promise((resolve, reject) => {
        db.run(queryExams, valuesExams, (err) => {
            if (err) resolve(false);
            else resolve(true);
        });
    });
}

const modifyExam = (db, exam_id, name, duration, backspace) => {
    const queryExams = `UPDATE exams SET name = ?, duration = ?, backspace = ? WHERE id = ?`;
    const valuesExams = [name, duration, backspace, exam_id];

    return new Promise((resolve, reject) => {
        db.run(queryExams, valuesExams, (err) => {
            if (err) resolve(false);
            else resolve(true);
        });
    });
}

module.exports = {
    getExams,
    getExamsIdFromTeacherId,
    checkIfExamExistsByName,
    checkIfExamExistsById,
    createExam,
    deleteExam,
    getExamOwners,
    addExamOwner,
    modifyExam
};

