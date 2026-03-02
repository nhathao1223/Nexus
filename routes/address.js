const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

/**
 * @swagger
 * /api/address/provinces:
 *   get:
 *     summary: Get all provinces in Vietnam
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: List of provinces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: number
 *                       name:
 *                         type: string
 */
router.get('/provinces', addressController.getProvinces);

/**
 * @swagger
 * /api/address/districts/{provinceCode}:
 *   get:
 *     summary: Get districts by province code
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         required: true
 *         schema:
 *           type: number
 *         description: Province code
 *     responses:
 *       200:
 *         description: List of districts
 *       400:
 *         description: Province code is required
 *       404:
 *         description: Province not found
 */
router.get('/districts/:provinceCode', addressController.getDistricts);

/**
 * @swagger
 * /api/address/wards/{districtCode}:
 *   get:
 *     summary: Get wards by district code
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: districtCode
 *         required: true
 *         schema:
 *           type: number
 *         description: District code
 *     responses:
 *       200:
 *         description: List of wards
 *       400:
 *         description: District code is required
 *       404:
 *         description: District not found
 */
router.get('/wards/:districtCode', addressController.getWards);

module.exports = router;
