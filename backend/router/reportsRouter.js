const express = require('express');
const ReportsController = require('../controllers/reportsController');
const router = express.Router();
const auth = require('../middleware/auth');
const report = require('../middleware/report');

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

router.post('/create', auth, report.createReport, async (req, res) => {
    try {
        await ReportsController.createReport(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete/users', auth, report.deleteReportByUsersId, async (req, res) => {
    try {
        await ReportsController.deleteReportByUsersId(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;