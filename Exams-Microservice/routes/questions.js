const express = require("express");
const { body } = require("express-validator");
const { verifyToken } = require("../helpers/authHandler");
const { handleBadRequest } = require("../helpers/errorHandler");
const { get, create, link, unlink, modify, modifyOption } = require("../controllers/questions.js");
const router = express.Router();

const validateCreateQuestionBody = [
    body("type").exists().isInt(),
    body("description").exists().isString(),
    body("options").exists().isArray(),
    body("answers").exists().isArray(),
    (req, res, next) => handleBadRequest(req, res, next, "createQuestion")
];

const validateModifyQuestionBody = [
    body("question_id").exists().isInt(),
    body("type").exists().isInt(),
    body("description").exists().isString(),
    (req, res, next) => handleBadRequest(req, res, next, "modifyQuestion")
];

const validateLinkWithExamBody = [
    body("question_id").exists().isInt(),
    body("exam_id").exists().isInt(),
    (req, res, next) => handleBadRequest(req, res, next, "linkWithExam")
]

const validateDeleteQuestionBody = [
    body("question_id").exists().isInt(),
    (req, res, next) => handleBadRequest(req, res, next, "deleteQuestion")
]

const validateModifyOptionBody = [
    body("question_id").exists().isInt(),
    body("option_id").exists().isInt(),
    body("description").exists().isString(),
    body("correct").exists().isInt(),
    (req, res, next) => handleBadRequest(req, res, next, "modifyOption")
]


module.exports = (db) => {
    const getQuestions = async (req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await get(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can get exams information.", data: null });
    }

    const createQuestion = async (req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await create(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    const deleteQuestion = async(req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await delete(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    const modifyQuestion = async(req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await modify(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    const modifyQuestionOption = async(req, res) => {
        const body = req.body;
        console.log(req.user)
        if (req.user.type == "teacher") {
            const response = await modifyOption(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    const linkWithExam = async(req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await link(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    const unlinkWithExam = async(req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await unlink(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    router.get("/", verifyToken, getQuestions);
    router.post("/", verifyToken, validateCreateQuestionBody, createQuestion);
    router.delete("/", verifyToken, validateDeleteQuestionBody, deleteQuestion);
    router.patch("/", verifyToken, validateModifyQuestionBody, modifyQuestion);
    router.patch("/modifyOption", verifyToken, validateModifyOptionBody, modifyQuestionOption);
    router.patch("/linkWithExam", verifyToken, validateLinkWithExamBody, linkWithExam);
    router.patch("/unlinkWithExam", verifyToken, validateLinkWithExamBody, unlinkWithExam);

    return router;
}