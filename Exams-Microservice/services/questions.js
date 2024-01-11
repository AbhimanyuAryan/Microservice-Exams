const getQuestions = (db) => {
    const query = "SELECT * FROM questions;"

    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const getQuestionById = (db, questionId) => {
    const query = "SELECT * FROM questions WHERE id = ? AND active = 1;";

    return new Promise((resolve, reject) => {
        db.get(query, [questionId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const getQuestionsFromExam = (db, examId) => {
    const query = "SELECT * FROM questions WHERE id IN (SELECT question_id FROM exams_questions WHERE exam_id = ?);";

    return new Promise((resolve, reject) => {
        db.all(query, [examId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const getQuestionOptionsById = (db, questionId) => {
    const query = "SELECT * FROM questions_options WHERE question_id = ?;";

    return new Promise((resolve, reject) => {
        db.all(query, [questionId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

const createQuestion = (db, type, description, options, answers) => {
    const query = "INSERT INTO questions (type, description, active) VALUES (?, ?, 1);";

    return new Promise((resolve, reject) => {
        db.run(query, [type, description], function (err) {
            if (err) reject(err);
            else {
                const questionId = this.lastID;

                const query = "INSERT INTO questions_options (question_id, description, correct) VALUES (?, ?, ?);";
                let count = 0;

                options.forEach((value, key) => {
                    db.run(query, [questionId, value, answers.includes(key) ? 1 : 0], function (err) {
                        if (err) {
                            const query = "DELETE FROM questions WHERE id = ?;";
                            db.run(query, [questionId], function (err) {
                                if (err) reject(err);
                                else {
                                    const query = "DELETE FROM questions_options WHERE question_id = ?;";
                                    db.run(query, [questionId], function (err) {
                                        if (err) reject(err);
                                        else reject(err);
                                    });
                                }
                            });
                            reject(err);
                        } else {
                            count++;
                            if (count == options.length) resolve(true);
                        }
                    });
                });
            }
        });
    });
}

const checkIfQuestionExistsById = (db, questionId) => {
    const query = "SELECT * FROM questions WHERE id = ? AND active = 1;";

    return new Promise((resolve, reject) => {
        db.get(query, [questionId], (err, row) => {
            if (err) reject(err);
            else {
                if (row) resolve(true);
                else resolve(false);
            }
        });
    });
}

const checkIfQuestionIsLinkedToExam = (db, examId, questionId) => {
    const query = "SELECT * FROM exams_questions WHERE question_id = ? AND exam_id = ?;";

    return new Promise((resolve, reject) => {
        db.get(query, [questionId, examId], (err, row) => {
            if (err) reject(err);
            else {
                if (row) resolve(true);
                else resolve(false);
            }
        });
    });
}

const linkQuestionWithExam = (db, examId, questionId) => {
    const query = "INSERT INTO exams_questions (exam_id, question_id) VALUES (?, ?);";

    return new Promise((resolve, reject) => {
        db.run(query, [examId, questionId], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

const unlinkQuestionWithExam = (db, examId, questionId) => { 
    const query = "DELETE FROM exams_questions WHERE exam_id = ? AND question_id = ?;";

    return new Promise((resolve, reject) => {
        db.run(query, [examId, questionId], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

const modifyQuestion = (db, questionId, type, description) => {
    const query = "UPDATE questions SET type = ?, description = ? WHERE id = ?;";

    return new Promise((resolve, reject) => {
        db.run(query, [type, description, questionId], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

const modifyQuestionOption = (db, questionId, option_id, description, correct) => {
    const query = "UPDATE questions_options SET description = ?, correct = ? WHERE question_id = ? AND option_id = ?;";

    return new Promise((resolve, reject) => {
        db.run(query, [description, correct, questionId, option_id], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

const checkIfOptionExistsById = (db, questionId, option_id) => {
    const query = "SELECT * FROM questions_options WHERE question_id = ? AND option_id = ?;";

    return new Promise((resolve, reject) => {
        db.get(query, [questionId, option_id], (err, row) => {
            if (err) reject(err);
            else {
                if (row) resolve(true);
                else resolve(false);
            }
        });
    });
}

module.exports = {
    getQuestions,
    getQuestionById,
    getQuestionsFromExam,
    getQuestionOptionsById,
    createQuestion,
    linkQuestionWithExam,
    unlinkQuestionWithExam,
    checkIfQuestionExistsById,
    checkIfQuestionIsLinkedToExam,
    modifyQuestion,
    checkIfOptionExistsById,
    modifyQuestionOption
};

