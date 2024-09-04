const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');

router.get('/subjects', async (req, res) => {
    // Fetch subjects
    try {
      const [rows] = await db.query('SELECT * FROM ugsubjects');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.post('/exams', async (req, res) => {
    // Create exams
    const { examName, startDate, endDate, selectedSubjects } = req.body;
  
    try {
      const [examResult] = await db.query(
        'INSERT INTO ugexamcreation (ugExamName, ugExamStartDate, ugExamEndDate) VALUES (?, ?, ?)',
        [examName, startDate, endDate]
      );
  
      const insertedExamId = examResult.insertId;
      for (const subjectId of selectedSubjects) {
        await db.query(
          'INSERT INTO ugselectedsubinexamcreation (ugExamCreationId, ugSubjectId) VALUES (?, ?)',
          [insertedExamId, subjectId]
        );
      }
      res.json({ message: 'Exam created successfully', ugExamCreationId: insertedExamId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/exams-with-subjects', async (req, res) => {
    // Display selected subjects in table
    try {
      const query = `
        SELECT e.ugExamCreationId, e.ugExamName, e.ugExamStartDate, e.ugExamEndDate, GROUP_CONCAT(s.ugSubjectName) AS ugsubjects
        FROM ugexamcreation AS e
        JOIN ugselectedsubinexamcreation AS ec ON e.ugExamCreationId = ec.ugExamCreationId
        JOIN ugsubjects AS s ON ec.ugSubjectId = s.ugSubjectId
        GROUP BY e.ugExamCreationId
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/exams/:ugExamCreationId', async (req, res) => {
    const ugExamCreationId = req.params.ugExamCreationId;
  
    try {
      await db.query('DELETE FROM ugexamcreation WHERE ugExamCreationId = ?', [ugExamCreationId]);
      await db.query("DELETE FROM ugselectedsubinexamcreation WHERE ugExamCreationId = ?",[ugExamCreationId])
      res.json({ message: `Exam with ID ${ugExamCreationId} deleted from the database` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;