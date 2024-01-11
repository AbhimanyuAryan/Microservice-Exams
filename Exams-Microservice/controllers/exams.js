const { getExams, getExamsIdFromTeacherId, checkIfExamExistsByName, checkIfExamExistsById, createExam, deleteExam, getExamOwners, addExamOwner, modifyExam } = require("../services/exams");
const { Response } = require("../models/response");

const get = async (body, db) => {
    let exams = await getExams(db);

    if (body.teacher_id) {
        let examsIdFromTeacher = await getExamsIdFromTeacherId(db, body.teacher_id);

        if (examsIdFromTeacher == null) {
            const statusCode = 500;
            const message = "Error retrieving exams.";
            const data = null;

            response = new Response(statusCode, message, data);
            return response;
        }
        exams = exams.filter(exam => examsIdFromTeacher.some(examIdFromTeacher => examIdFromTeacher.id_exam == exam.id));

        const statusCode = 200;
        const message = "Exams retrieved successfully.";
        const data = exams;

        response = new Response(statusCode, message, data);

    } else if (body.exams_ids) {
        exams = exams.filter(exam => body.exams_ids.includes(exam.id));

        const statusCode = 200;
        const message = "Exams retrieved successfully.";
        const data = exams;

        response = new Response(statusCode, message, data);
    } else {
        const statusCode = 200;
        const message = "Exams retrieved successfully.";
        const data = exams;

        response = new Response(statusCode, message, data);
    }

    return response;
}

const create = async (user, body, db) => {
    const examExists = await checkIfExamExistsByName(db, body.name);

    if (examExists) {
        const statusCode = 409;
        const message = "Exam already exists.";
        const data = null;

        response = new Response(statusCode, message, data);
        return response;
    }

    const status = await createExam(db, body, user._id);

    if (status == true) {
        const statusCode = 201;
        const message = "Exam created successfully.";
        const data = null;

        response = new Response(statusCode, message, data);
    } else {
        const statusCode = 500;
        const message = "Error creating exam.";
        const data = null;

        response = new Response(statusCode, message, data);
    }
    return response;
}

const del = async (user, exam_id, db) => {
    const examExists = await checkIfExamExistsById(db, exam_id);

    if (!examExists) {
        const statusCode = 404;
        const message = "Exam not found.";
        const data = null;

        response = new Response(statusCode, message, data);
        return response;
    }

    const examOnwers = await getExamOwners(db, exam_id);

    if (examOnwers.some(examOnwer => examOnwer.id_professor == user.id)) {
        const status = await deleteExam(db, exam_id);

        if (status == true) {
            const statusCode = 200;
            const message = "Exam deleted successfully.";
            const data = null;

            response = new Response(statusCode, message, data);
        } else {
            const statusCode = 500;
            const message = "Error deleting exam.";
            const data = null;

            response = new Response(statusCode, message, data);
        }
    } else {
        const statusCode = 401;
        const message = "Unauthorized: Only exam owners can delete exams.";
        const data = null;

        response = new Response(statusCode, message, data);
    }

    return response;
}

const modify = async (exam_id, name, duration, backspace, db) => {
    let exam = await getExams(db);

    exam = exam.filter(exam => exam.id == exam_id)[0];

    if (exam == null) {
        const statusCode = 404;
        const message = "Exam not found.";
        const data = null;

        response = new Response(statusCode, message, data);
        return response;
    }

    if (name == null) name = exam.name;
    if (duration == null) duration = exam.duration;
    if (backspace == null) backspace = exam.backspace;
    else {
        if (backspace == true) backspace = 1;
        else backspace = 0;
    }

    const status = await modifyExam(db, exam_id, name, duration, backspace);

    if (status == true) {
        const statusCode = 200;
        const message = "Exam modified successfully.";
        const data = null;

        response = new Response(statusCode, message, data);
    } else {
        const statusCode = 500;
        const message = "Error modifying exam.";
        const data = null;

        response = new Response(statusCode, message, data);
    }

    return response;
}

const share = async (exam_id, teacher_id, db) => {
    const examExists = await checkIfExamExistsById(db, exam_id);

    if (!examExists) {
        const statusCode = 404;
        const message = "Exam not found.";
        const data = null;

        response = new Response(statusCode, message, data);
        return response;
    }

    const examOnwers = await getExamOwners(db, exam_id);

    if (examOnwers.some(examOnwer => examOnwer.id_professor == teacher_id)) {
        const statusCode = 409;
        const message = "Exam already shared with this teacher.";
        const data = null;

        response = new Response(statusCode, message, data);
        return response;
    }

    const status = await addExamOwner(db, exam_id, teacher_id);

    if (status == true) {
        const statusCode = 200;
        const message = "Exam shared successfully.";
        const data = null;

        response = new Response(statusCode, message, data);
    }
    else {
        const statusCode = 500;
        const message = "Error sharing exam.";
        const data = null;

        response = new Response(statusCode, message, data);
    }

    return response;
}

module.exports = {
    get,
    create,
    del,
    modify,
    share
};
