const express = require('express');
const ReportsController = require('../controllers/reportsController');
const router = express.Router();

router.get('/author/:id', async (req, res) => {
    try {
        await ReportsController.getAllByAuthorId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/recipient/:id', async (req, res) => {
    try {
        await ReportsController.getAllByRecipientId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        await ReportsController.getReportById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:authorId/:recipientId', async (req, res) => {
    try {
        await ReportsController.getCheckReport(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        await ReportsController.createReport(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        await ReportsController.deleteReport(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;