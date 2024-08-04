const categorySchema = require("../schema/categories")
const commonService = require("../helper/commonService")
const questionSchema = require("../schema/questions");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require('multer');

const csvtojson = require('csvtojson');

const fs = require('fs');
const path = require('path');
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await categorySchema.aggregate([
            { $project: { _id: 1, categoryName: 1 } }
        ]);
        return res.send({
            success: true,
            response: categories,
            message: "All categories retrieved successfully",
        });
    } catch (err) {
        return commonService.sendResponseData(res, 500, false, err.message ? err.message : err, {});

    }
};

exports.getquestions = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const questions = await questionSchema.aggregate([
            { $match: { categories: mongoose.Types.ObjectId(categoryId) } }, // Match questions in the specified category
            {
                $lookup: {
                    from: 'categories', // The name of the collection to join
                    localField: 'categories', // Field from the questions collection
                    foreignField: '_id', // Field from the categories collection
                    as: 'categoryDetails' // The name of the new field to add
                }
            },
            { $unwind: '$categoryDetails' }, // Unwind the categoryDetails array
            {
                $addFields: {
                    categoryName: '$categoryDetails.categoryName' // Add categoryName to the root level
                }
            },
            {
                $project: {
                    _id: 1,
                    text: 1,
                    'categoryName': 1 // Only the fields need
                }
            }
        ]);
        return res.send({
            success: true,
            response: questions,
            message: "Questions retrieved successfully",
        });
      

    } catch (err) {
        return commonService.sendResponseData(res, 500, false, err.message ? err.message : err, {});

    }
};

exports.uploadQuestions = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const filePath = req.file.path


        // Convert CSV to JSON
        const jsonArray = await csvtojson().fromFile(filePath);
        const questionsMap = {};
        const questions = [];

        for (const row of jsonArray) {
            console.log("row,", row)
            const { text, categoryquestion } = row;
            const categoryName = categoryquestion.trim();

            // Find or create the category
            let category = await categorySchema.findOne({ categoryName });

            if (!category) {
                // Create a new category if it doesn't exist
                category = new categorySchema({ categoryName });
                await category.save();
            }

            // Check if the question already exists in the questionsMap
            if (!questionsMap[text]) {
                questionsMap[text] = {
                    text,
                    categories: []
                };
                questions.push(questionsMap[text]);
            }

            // Add the category ID to the question's categories array if it's not already included
            if (!questionsMap[text].categories.includes(category._id)) {
                questionsMap[text].categories.push(category._id);
            }


        }
        console.log("question", questions);
        // Insert questions into the database
        await questionSchema.insertMany(questions);


        return res.send({
            success: true,
            response: {},
            message: "Questions added successfully",
        });
       
    } catch (err) {
        return commonService.sendResponseData(res, 500, false, err.message ? err.message : err, {});
    } finally {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log('Failed to delete temporary file:', err);

            }
        });
    }
};