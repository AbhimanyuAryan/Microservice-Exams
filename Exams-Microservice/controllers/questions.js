const { getQuestions, getQuestionById, getQuestionsFromExam, getQuestionOptionsById, createQuestion, linkQuestionWithExam, unlinkQuestionWithExam, checkIfQuestionExistsById, checkIfQuestionIsLinkedToExam, checkIfOptionExistsById, modifyQuestion, modifyQuestionOption } = require("../services/questions");
const { checkIfExamExistsById } = require('../services/exams');
const { Response } = require("../models/response");

const get = async (body, db) => {
    if (body.question_id) {
        const question = await getQuestionById(db, body.question_id);

        if (question == null) {
            const statusCode = 404;
            const message = "Question not found.";
            const data = null;

            return new Response(statusCode, message, data);
        }

        let options = await getQuestionOptionsById(db, body.question_id);

        const statusCode = 200;
        const message = "Question retrieved successfully.";
        const data = {
            id: question.id,
            type: question.type,
            description: question.description,
            options: options.map(option => {
                return {
                    id: option.option_id,
                    description: option.description,
                    correct: option.correct
                }
            })
        };

        response = new Response(statusCode, message, data);

    } else if(body.exam_id) {
        if(await checkIfExamExistsById(db, body.exam_id) == false) {
            const statusCode = 404;
            const message = "Exam does not exist.";
            const data = null;

            return new Response(statusCode, message, data);
        }

        let questions = await getQuestionsFromExam(db, body.exam_id);

        let questionsData = [];

        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            let options = await getQuestionOptionsById(db, question.id);

            question.options = options.map(option => {
                return {
                    id: option.option_id,
                    description: option.description,
                    correct: option.correct
                }
            });
            questionsData.push(question);
        }

        const statusCode = 200;
        const message = "Questions retrieved successfully.";
        const data = questionsData;

        response = new Response(statusCode, message, data);

    } else {
        let questions = await getQuestions(db);

        let questionsData = [];

        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            let options = await getQuestionOptionsById(db, question.id);

            console.log(options);

            question.options = options.map(option => {
                return {
                    id: option.option_id,
                    description: option.description,
                    correct: option.correct
                }
            });
            questionsData.push(question);
        }

        const statusCode = 200;
        const message = "Questions retrieved successfully.";
        const data = questionsData;

        response = new Response(statusCode, message, data);
    }

    return response;
}

const create = async (body, db) => {
    const status = await createQuestion(db, body.type, body.description, body.options, body.answers);

    if (status == true) {
        const statusCode = 201;
        const message = "Question created successfully.";
        const data = null;

        response = new Response(statusCode, message, data);
    } else {
        const statusCode = 500;
        const message = "Error creating question.";
        const data = null;

        response = new Response(statusCode, message, data);
    }

    return response;
}

const link = async (body, db) => {
    if(await checkIfExamExistsById(db, body.exam_id) == false) {
        const statusCode = 404;
        const message = "Exam does not exist.";
        const data = null;

        return new Response(statusCode, message, data);
    }
    
    if(await checkIfQuestionExistsById(db, body.question_id) == false) {
        const statusCode = 404;
        const message = "Question does not exist.";
        const data = null;

        return new Response(statusCode, message, data);
    }

    if(await checkIfQuestionIsLinkedToExam(db, body.exam_id, body.question_id) == true) {
        const statusCode = 404;
        const message = "Question already linked to exam.";
        const data = null;

        return new Response(statusCode, message, data);
    }

    const status = await linkQuestionWithExam(db, body.exam_id, body.question_id);

    if (status == true) {
        const statusCode = 201;
        const message = "Question linked successfully.";
        const data = null;

        return new Response(statusCode, message, data);

    } else {
        const statusCode = 500;
        const message = "Error linking question.";
        const data = null;

        return new Response(statusCode, message, data);
    }
}

const unlink = async (body, db) => {
    if(await checkIfExamExistsById(db, body.exam_id) == false) {
        const statusCode = 404;
        const message = "Exam does not exist.";
        const data = null;

        return new Response(statusCode, message, data);
    }
    
    if(await checkIfQuestionExistsById(db, body.question_id) == false) {
        const statusCode = 404;
        const message = "Question does not exist.";
        const data = null;

        return new Response(statusCode, message, data);
    }

    if(await checkIfQuestionIsLinkedToExam(db, body.exam_id, body.question_id) == false) {
        const statusCode = 404;
        const message = "Question is not linked to exam.";
        const data = null;

        return new Response(statusCode, message, data);
    }

    const status = await unlinkQuestionWithExam(db, body.exam_id, body.question_id);

    if (status == true) {
        const statusCode = 201;
        const message = "Question unlinked successfully.";
        const data = null;

        return new Response(statusCode, message, data);

    } else {
        const statusCode = 500;
        const message = "Error unlinking question.";
        const data = null;

        return new Response(statusCode, message, data);
    }
}

const modify = async (body, db) => {
    if(await checkIfQuestionExistsById(db, body.question_id) == false) {
        const statusCode = 404;
        const message = "Question does not exist.";
        const data = null;

        return new Response(statusCode, message, data);
    }

    const status = await modifyQuestion(db, body.question_id, body.type, body.description);

    if (status == true) {
        const statusCode = 201;
        const message = "Question modified successfully.";
        const data = null;

        response = new Response(statusCode, message, data);
    } else {
        const statusCode = 500;
        const message = "Error modifying question.";
        const data = null;

        response = new Response(statusCode, message, data);
    }

    return response;
}

const modifyOption = async (body, db) => {
    if(await checkIfQuestionExistsById(db, body.question_id) == false) {
        const statusCode = 404;
        const message = "Question does not exist.";
        const data = null;

        return new Response(statusCode, message, data);
    }

    if(await checkIfOptionExistsById(db, body.question_id, body.option_id) == false) {
        const statusCode = 404;
        const message = "Question option does not exist.";
        const data = null;

        return new Response(statusCode, message, data);
    }

    const status = await modifyQuestionOption(db, body.question_id, body.option_id, body.description, body.correct);

    if (status == true) {
        const statusCode = 201;
        const message = "Question modified successfully.";
        const data = null;

        response = new Response(statusCode, message, data);
    } else {
        const statusCode = 500;
        const message = "Error modifying question.";
        const data = null;

        response = new Response(statusCode, message, data);
    }

    return response;
}

module.exports = { get, create, link, unlink, modify, modifyOption };