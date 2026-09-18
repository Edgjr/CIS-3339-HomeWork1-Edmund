require('dotenv').config();

const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');


const app = express();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('cis3339_homework1');

const studentsCollection = db.collection('students');
const coursesCollection = db.collection('courses');
const enrollmentsCollection = db.collection('enrollments');

app.use(cors());
app.use(express.json());

async function loadStudents() {
    return await studentsCollection.find({}).toArray();
}

async function saveStudents(students) {
    await studentsCollection.deleteMany({});

    if (students.length > 0) {
        await studentsCollection.insertMany(students);
    }
}

async function loadCourses() {
    return await coursesCollection.find({}).toArray();
}

async function saveCourses(courses) {
    await coursesCollection.deleteMany({});

    if (courses.length > 0) {
        await coursesCollection.insertMany(courses);
    }
}

async function loadEnrollments() {
    return await enrollmentsCollection.find({}).toArray();
}

async function saveEnrollments(enrollments) {
    await enrollmentsCollection.deleteMany({});

    if (enrollments.length > 0) {
        await enrollmentsCollection.insertMany(enrollments);
    }
}

// Endpoint to search for a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const students = await loadStudents();
        const student = students.find((item) => item.name === name);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send(student);
    } catch (error) {
        console.error('Error finding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to list all students
app.get('/students', async (req, res) => {
    try {
        const students = await loadStudents();

        res.send(students);
    } catch (error) {
        console.error('Error loading students:', error);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
});

// Endpoint to save a student
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;

        if (!name || !id || !phone || !zip) {
            return res.status(400).send({
                error: 'All fields (name, id, phone, zip) are required'
            });
        }

        const students = await loadStudents();

        const duplicateStudent = students.find(
            (student) => student.id === id
        );

        if (duplicateStudent) {
            return res.status(409).send({
                error: 'A student with this ID already exists'
            });
        }

        const newStudent = { name, id, phone, zip };

        students.push(newStudent);
        await saveStudents(students);

        res.status(201).send({
            message: 'Student added successfully',
            student: newStudent
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const students = await loadStudents();
        const index = students.findIndex((item) => item.name === name);
        if (index === -1) {
            return res.status(404).send({ error: 'Student not found' });
        }

        const deletedStudent = students.splice(index, 1)[0];

        await saveStudents(students);

        await enrollmentsCollection.deleteMany({
            studentId: deletedStudent.id
});

        res.send({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to save a course
app.post('/add-course', async (req, res) => {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).send({
                error: 'Course ID and course name are required'
            });
        }

        const courses = await loadCourses();

        const duplicateCourse = courses.find(
            (course) => course.id === id
        );

        if (duplicateCourse) {
            return res.status(409).send({
                error: 'A course with this ID already exists'
            });
        }

        const newCourse = { id, name };

        courses.push(newCourse);
        await saveCourses(courses);

        res.status(201).send({
            message: 'Course added successfully',
            course: newCourse
        });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
});

// Endpoint to list all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await loadCourses();

        res.send(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
});

// Endpoint to delete a course by ID
app.delete('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const courses = await loadCourses();

        const index = courses.findIndex((course) => course.id === id);

        if (index === -1) {
            return res.status(404).send({
                error: 'Course not found'
            });
        }

        const deletedCourse = courses.splice(index, 1)[0];

        await saveCourses(courses);

        await enrollmentsCollection.deleteMany({
            courseId: deletedCourse.id
});

        res.send({
            message: 'Course deleted successfully',
            course: deletedCourse
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
});

// Endpoint to create an enrollment
app.post('/enrollments', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).send({
                error: 'Student ID and course ID are required'
            });
        }

        const students = await loadStudents();
        const courses = await loadCourses();
        const enrollments = await loadEnrollments();

        const studentExists = students.some(
            (student) => student.id === studentId
        );

        if (!studentExists) {
            return res.status(404).send({
                error: 'Student not found'
            });
        }

        const courseExists = courses.some(
            (course) => course.id === courseId
        );

        if (!courseExists) {
            return res.status(404).send({
                error: 'Course not found'
            });
        }

        const duplicateEnrollment = enrollments.find(
            (enrollment) =>
                enrollment.studentId === studentId &&
                enrollment.courseId === courseId
        );

        if (duplicateEnrollment) {
            return res.status(409).send({
                error: 'This student is already enrolled in this course'
            });
        }

        const newEnrollment = {
            studentId,
            courseId
        };

        enrollments.push(newEnrollment);
        await saveEnrollments(enrollments);

        res.status(201).send({
            message: 'Enrollment created successfully',
            enrollment: newEnrollment
        });
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
});

// Endpoint to list students enrolled in a course
app.get('/enrollments/course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;

        const courses = await loadCourses();
        const students = await loadStudents();
        const enrollments = await loadEnrollments();

        const courseExists = courses.some(
            (course) => course.id === courseId
        );

        if (!courseExists) {
            return res.status(404).send({
                error: 'Course not found'
            });
        }

        const courseEnrollments = enrollments.filter(
            (enrollment) => enrollment.courseId === courseId
        );

        const enrolledStudents = courseEnrollments
            .map((enrollment) =>
                students.find(
                    (student) => student.id === enrollment.studentId
                )
            )
            .filter(Boolean);

        res.send(enrolledStudents);
    } catch (error) {
        console.error('Error loading course roster:', error);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
});

const PORT = 3000;

async function startServer() {
    try {
        await client.connect();

        await studentsCollection.createIndex(
            { id: 1 },
            { unique: true }
        );

        await coursesCollection.createIndex(
            { id: 1 },
            { unique: true }
        );

        await enrollmentsCollection.createIndex(
            { studentId: 1, courseId: 1 },
            { unique: true }
        );

        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

startServer();
