
// backend/controllers/studentController.js
import Student, { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../models/Student';

export async function getAllStudents(req, res) {
    try {
        const students = await find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getStudentById(req, res) {
    try {
        const student = await findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function createStudent(req, res) {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateStudent(req, res) {
    try {
        const updatedStudent = await findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deleteStudent(req, res) {
    try {
        await findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}