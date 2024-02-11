package com.wipdev.eWiLL_backend.endpoints.oral_examinator


import com.wipdev.eWiLL_backend.endpoints.payload.requests.QuestionPL
import io.swagger.v3.oas.annotations.tags.Tag
import com.wipdev.eWiLL_backend.database.tables.oralexaminator.Question
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import com.wipdev.eWiLL_backend.services.oral_examinator.QuestionService
import org.springframework.security.access.prepost.PreAuthorize



@RestController
@RequestMapping("/api/questions")
@Tag(name = "Question", description = "Question API used for providing questions to the website")
class QuestionController {

    @Autowired
    lateinit var questionService: QuestionService

    @PostMapping("/create")
    fun createQuestion(@RequestBody questionPL: QuestionPL) {
        val question = Question()
        question.id = null
        question.questionText = questionPL.questionText
        question.link = questionPL.link
        question.solutions = questionPL.solutions
        questionService.save(question)
    }
    @PostMapping("/post")
    @ResponseBody
    fun getQuestion(): List<Question> {
        return questionService.findAll()
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    fun deleteQuestion(@PathVariable id: Long) {
        questionService.delete(id)
    }


}