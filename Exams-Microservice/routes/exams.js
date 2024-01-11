const express = require("express");
const { body } = require("express-validator");
const { verifyToken } = require("../helpers/authHandler");
const { handleBadRequest } = require("../helpers/errorHandler");
const { get, create, del, modify, share } = require("../controllers/exams");
const router = express.Router();

const validateCreateExamBody = [
    body("name").exists().isString(),
    body("duration").exists().isInt(),
    body("backspace").exists().isBoolean(),
    (req, res, next) => handleBadRequest(req, res, next, "createExams")
];

const validateDeleteExamBody = [
    body("exam_id").exists().isInt(),
    (req, res, next) => handleBadRequest(req, res, next, "deleteExams")
];

const validateModifyExamBody = [
    body("exam_id").exists().isInt(),
    body("name").optional().isString(),
    body("duration").optional().isInt(),
    body("backspace").optional().isBoolean(),
    (req, res, next) => handleBadRequest(req, res, next, "modifyExams")
];

const validateShareExamBody = [
    body("exam_id").exists().isInt(),
    body("teacher_id").exists().isInt(),
    (req, res, next) => handleBadRequest(req, res, next, "shareExams")
];

module.exports = (db) => {
    const getExams = async (req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await get(body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can get exams information.", data: null });
    }

    const createExam = async (req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await create(req.user, body, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    const deleteExam = async (req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await del(req.user, body.exam_id, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can create exams.", data: null });
    }

    const modifyExam = async (req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await modify(body.exam_id, body.name, body.duration, body.backspace, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can modify exams.", data: null });
    }

    const shareExam = async (req, res) => {
        const body = req.body;
        if (req.user.type == "teacher") {
            const response = await share(body.exam_id, body.teacher_id, db);
            res.status(response.statusCode).send({ message: response.message, data: response.data });

            return;
        }

        res.status(401).send({ message: "Unauthorized: Only teachers can share exams.", data: null });
    }

    router.get("/", verifyToken, getExams);
    router.post("/", verifyToken, validateCreateExamBody, createExam);
    router.delete("/", verifyToken, validateDeleteExamBody, deleteExam);
    router.patch("/", verifyToken, validateModifyExamBody, modifyExam);
    router.post("/share", verifyToken, validateShareExamBody, shareExam);

    return router;
}