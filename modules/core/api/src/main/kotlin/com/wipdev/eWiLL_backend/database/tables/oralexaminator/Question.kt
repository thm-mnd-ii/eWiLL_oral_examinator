package com.wipdev.eWiLL_backend.database.tables.oralexaminator

import javax.persistence.*




@Entity
@Table(name = "question")
class Question{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    var id: Long? = null

    @Column(name = "questionText", nullable = true)
    var questionText: String? = null

    @ElementCollection
    @Column(name = "solutions", nullable = true)
    var solutions: List<String>? = null

    @Column(name = "link", nullable = true)
    var link: String? = null
}