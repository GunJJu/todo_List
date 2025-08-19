const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Todo = require("../models/todo")
const ensureObjectId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: "유효하지 않은 ID형식 입니다!" })
        return false
    } else {
        return false
    }
}

router.post('/', async (req, res) => {
    try {
        const newTodo = new Todo(req.body)
        const saveTodo = await newTodo.save()
        res.status(201).json(saveTodo)
    } catch (error) {
        res.status(400).json({ error: "할일을 추가하지 못했어여 ㅜ" })

    }
})

router.get('/', async (req, res) => {
    try {
        const todo = await Todo.find().sort({ createdAT: -1 })
        res.status(201).json(todo)
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했어여 ㅜ" })

    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const todo = await Todo.findById(id)
        if (!todo) {
            return res.status(400).json({ message: "해당 ID의 할일 목록이 없습니다!" })
        }


        res.status(201).json({ message: "불러오기 성공!!", todo })
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했어여 ㅜ" })

    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const updateDate = req.body
        if (!ensureObjectId(id, res)) return

        const updated = await Todo.findByIdAndUpdate(id, updateDate, {
            new: true,
            runValidators: true
        })

        if (!updated) {
            return res.status(400).json({ message: "해당 ID의 할일 목록이 없습니다!" })
        }

        res.status(201).json({ message: "수정하기 성공!!", updated })
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했어여 ㅜ" })

    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const deleted = await Todo.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(400).json({ message: "해당 ID의 할일 목록이 없습니다!" })
        }

        const remaining = await Todo.find().sort({ createdAT: -1 })

        res.status(201).json({ message: "삭제하기 성공!!", deleted: deleted._id, todos: remaining })
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했어여 ㅜ" })

    }
})

router.patch('/:id/check', async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return
        const { isCompleted } = req.body

        if (typeof isCompleted !== 'boolean') {
            return res.status(400).json({ message: "isCompleted는 반드시 Boolean이어야 합니다." })
        }

        const updated = await Todo.findByIdAndUpdate(id, { isCompleted }, { new: true, runValidators: true, context: 'query' })

        if (!updated) {
            return res.status(400).json({ message: "해당 ID의 할일 목록이 없습니다!" })
        }

        res.status(201).json({ message: "체크박스 상태 수정하기 성공!!", todo: updated })
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했어여 ㅜ" })

    }
})

router.patch("/:id/text", async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return
        const { text } = req.body

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "text는 필수입니다." })
        }

        const updated = await Todo.findByIdAndUpdate(id,
            { text: text.trim() },
            { new: true, runValidators: true, context: 'query' }
        )
        if (!updated) {
            return res.status(404).json({ message: '해당 Id의 todo가 없습니다.' })
        }

        res.status(201).json({ message: "텍스트 수정하기 성공", todo: updated })
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했습니다." })
    }
})


module.exports = router