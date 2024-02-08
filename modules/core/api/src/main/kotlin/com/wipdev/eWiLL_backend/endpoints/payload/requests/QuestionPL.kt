package com.wipdev.eWiLL_backend.endpoints.payload.requests



data class QuestionPL(val id : Long?, val text: String?, val link: String, val course_id: Long, val solution: CharArray) {


}