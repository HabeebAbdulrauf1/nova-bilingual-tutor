window.NOVA_CONTENT = Object.freeze({
  training: [
    {
      id: "T1",
      title: "Checking Whether a Source Exists",
      question: "You ask an AI tool for a journal article about social media and sleep. It gives you an author name, article title, journal name, year, and a web link. What is the best next step before using the source in an assignment?",
      options: {
        A: "Use it because the citation looks complete.",
        B: "Search for the original article and confirm that the source exists and the publication details match.",
        C: "Use it if the article title is closely related to your topic.",
        D: "Use it if the AI says it is confident."
      },
      correct: "B",
      bestAnswer: "Search for the original article and confirm that the source exists and the publication details match.",
      principle: "Check that an AI-generated source actually exists before using it.",
      explanationA: "AI can generate a citation that looks complete even when the source does not exist or some details are wrong. Before using it, search for the original article and confirm that the source exists and that the publication details match.",
      explanationB: "AI fit give you citation wey look complete even when the source no exist or some details wrong. Before you use am, search for the original article and confirm say the source exist and the publication details match."
    },
    {
      id: "T2",
      title: "Checking an AI Summary",
      question: "An AI tool summarizes an article for your assignment. The summary is clear, but one important statement seems stronger than what the original article may have said. What is the best response?",
      options: {
        A: "Keep it because a clear summary is usually accurate.",
        B: "Delete the whole summary without checking anything.",
        C: "Keep it if the wording sounds academic.",
        D: "Compare the important statement with the original source before using it."
      },
      correct: "D",
      bestAnswer: "Compare the important statement with the original source before using it.",
      principle: "Check important AI-generated summaries against the original source.",
      explanationA: "An AI summary can sound clear and still change what the original source actually says. When an important claim matters to your work, compare it with the original source. The goal is not to reject every AI summary; it is to make sure the summary represents the source accurately.",
      explanationB: "AI summary fit sound clear and still change wetin the original source really talk. If one important claim matter for your work, compare am with the original source. The point no be to reject every AI summary; na to make sure say the summary represent the source correctly."
    },
    {
      id: "T3",
      title: "Confidence Is Not Evidence",
      question: "An AI tool gives a polished answer and says it is “very confident,” but it provides no evidence for an important factual claim. Which statement is best?",
      options: {
        A: "Fluent and confident wording does not by itself prove that the claim is accurate.",
        B: "The claim is probably correct because the answer sounds professional.",
        C: "The claim must be wrong because AI confidence is never useful.",
        D: "The claim is correct if the answer is detailed enough."
      },
      correct: "A",
      bestAnswer: "Fluent and confident wording does not by itself prove that the claim is accurate.",
      principle: "Confidence and fluent wording are not proof of accuracy.",
      explanationA: "AI can sound very certain even when an answer is wrong or incomplete. Confidence, detail, and polished writing are presentation cues, not proof. Check the evidence behind important claims before relying on them.",
      explanationB: "AI fit sound very sure even when the answer wrong or incomplete. Confidence, plenty detail, and polished writing no be proof say the answer correct. Check the evidence behind important claims before you rely on them."
    },
    {
      id: "T4",
      title: "Matching Conclusions to Evidence",
      question: "A study finds that students who exercise more often also tend to have higher grades. An AI response concludes, “Exercise causes students to get higher grades.” What is the main problem with that conclusion?",
      options: {
        A: "Exercise can never affect academic performance.",
        B: "Grades should not be used in research.",
        C: "A relationship between two things does not by itself prove that one caused the other.",
        D: "The conclusion is automatically correct if the study has many participants."
      },
      correct: "C",
      bestAnswer: "A relationship between two things does not by itself prove that one caused the other.",
      principle: "Match the strength of a conclusion to the strength of the evidence.",
      explanationA: "When two things occur together, that does not automatically mean that one caused the other. Other factors may help explain the relationship. A causal conclusion needs evidence strong enough to support a cause-and-effect claim.",
      explanationB: "If two things happen together, e no automatically mean say one cause the other. Other factors fit explain the relationship. Before you make a cause-and-effect claim, make sure say the evidence strong enough to support am."
    },
    {
      id: "T5",
      title: "Avoiding Overgeneralization",
      question: "An AI tool summarizes a survey of 60 students from one private university and states, “Nigerian university students prefer AI tutoring to human tutoring.” What is the strongest concern?",
      options: {
        A: "A survey can never be used to study student preferences.",
        B: "The finding is automatically wrong because fewer than 100 students participated.",
        C: "The conclusion is correct because all participants were university students.",
        D: "The conclusion may be broader than the group that was actually studied."
      },
      correct: "D",
      bestAnswer: "The conclusion may be broader than the group that was actually studied.",
      principle: "Do not make a broader claim than the evidence can support.",
      explanationA: "Evidence from one small group can tell us something about that group, but it does not automatically represent everyone. Before making a broad claim, consider who was studied, where they were studied, and how far the evidence can reasonably be generalized.",
      explanationB: "Evidence from one small group fit tell us something about that group, but e no automatically represent everybody. Before you make broad claim, check who dem study, where dem study them, and how far the evidence fit reasonably generalize."
    },
    {
      id: "T6",
      title: "Using AI Selectively",
      question: "An AI tool produces a useful outline for an assignment, but two factual claims have no sources and one paragraph is too broad. What is the best response?",
      options: {
        A: "Submit the output exactly as written because the outline is useful.",
        B: "Keep the useful structure, revise the weak paragraph, and verify the unsupported claims.",
        C: "Reject the entire output because some parts are weak.",
        D: "Ask the AI to make the unsupported claims sound more confident."
      },
      correct: "B",
      bestAnswer: "Keep the useful structure, revise the weak paragraph, and verify the unsupported claims.",
      principle: "Use AI output selectively rather than accepting or rejecting everything.",
      explanationA: "Good AI use requires judgment. You can keep useful parts, revise weak parts, and verify claims you are uncertain about. The best response depends on the quality of each part of the output rather than treating all AI content as equally reliable or unreliable.",
      explanationB: "Good AI use need judgment. You fit keep useful parts, revise weak parts, and verify claims wey you no sure about. The best response depend on the quality of each part, instead of treating every AI content as equally reliable or unreliable."
    }
  ],
  posttest: [
    {
      id: "P1C", type: "conceptual", principle: "source_verification",
      question: "An AI answer lists a research article with an author, title, year, and a link. Why is that information alone not enough to know that the source is ready to use?",
      options: {
        A: "A research article can only be used if a lecturer recommends it.",
        B: "Any source produced by AI must be rejected.",
        C: "Realistic-looking details do not guarantee that the source exists or that the details are correct.",
        D: "A source is reliable only when the title is very long."
      }, correct: "C"
    },
    {
      id: "P1P", type: "procedural", principle: "source_verification",
      question: "An AI tool gives you four sources for a class paper. What should you do before adding them to your reference list?",
      options: {
        A: "Find each original source and confirm that it exists and that the publication details match.",
        B: "Use all four because multiple sources reduce the chance of error.",
        C: "Keep only the sources with the most academic-sounding titles.",
        D: "Ask the AI to rewrite all four references in APA style and then use them."
      }, correct: "A"
    },
    {
      id: "P2C", type: "conceptual", principle: "summary_fidelity",
      question: "A research article says a new study method “may be associated with better performance,” but an AI summary says the study method “has been proven to improve grades.” What is the main problem?",
      options: {
        A: "The summary is too short.",
        B: "The summary makes the original finding stronger than the evidence supports.",
        C: "The original article should not discuss grades.",
        D: "AI summaries should never use the word “study.”"
      }, correct: "B"
    },
    {
      id: "P2P", type: "procedural", principle: "summary_fidelity",
      question: "An AI summary includes a surprising statistic that is important to your assignment. What is the best next step before using the statistic?",
      options: {
        A: "Use it because unusual statistics make an argument stronger.",
        B: "Remove every statistic from the summary.",
        C: "Ask the AI to repeat the statistic in a more formal style.",
        D: "Check the statistic in the original source."
      }, correct: "D"
    },
    {
      id: "P3C", type: "conceptual", principle: "confidence_fluency",
      question: "Two AI answers disagree. One is longer, more detailed, and more confident than the other. What can you conclude from writing style alone?",
      options: {
        A: "Writing style alone does not establish which answer is more accurate.",
        B: "The longer answer is more accurate.",
        C: "The more confident answer is more accurate.",
        D: "Both answers must be wrong because they disagree."
      }, correct: "A"
    },
    {
      id: "P3P", type: "procedural", principle: "confidence_fluency",
      question: "An AI answer sounds authoritative but gives no evidence for an important factual claim in your essay. What should you do?",
      options: {
        A: "Accept it because authoritative wording shows expertise.",
        B: "Reject the entire answer without checking any part.",
        C: "Verify the important claim using an appropriate source before relying on it.",
        D: "Use it only if the AI repeats the claim twice."
      }, correct: "C"
    },
    {
      id: "P4C", type: "conceptual", principle: "evidence_strength",
      question: "A survey finds that students who drink coffee more often also report studying later at night. Which conclusion is best supported?",
      options: {
        A: "Coffee definitely causes students to study later.",
        B: "Studying later definitely causes students to drink coffee.",
        C: "There is no relationship because the study used a survey.",
        D: "Coffee use and late-night studying are related in the survey, but the survey alone does not show which causes which."
      }, correct: "D"
    },
    {
      id: "P4P", type: "procedural", principle: "evidence_strength",
      question: "An AI-generated paragraph says, “Students who join campus clubs have higher GPAs, so joining a club increases GPA.” What is the best revision?",
      options: {
        A: "Keep the statement because student clubs are generally beneficial.",
        B: "State that club participation and GPA were related, and avoid claiming cause unless stronger evidence supports it.",
        C: "Delete every mention of GPA.",
        D: "Change “increases” to “guarantees.”"
      }, correct: "B"
    },
    {
      id: "P5C", type: "conceptual", principle: "generalization",
      question: "A study interviews 40 nursing students at one university about academic AI use. An AI answer concludes, “Nigerian undergraduates believe AI improves learning.” Why is this conclusion too broad?",
      options: {
        A: "Interview studies cannot produce useful evidence.",
        B: "Forty participants is never acceptable in research.",
        C: "The group studied does not justify a claim about all Nigerian undergraduates.",
        D: "Nursing students cannot use AI for academic work."
      }, correct: "C"
    },
    {
      id: "P5P", type: "procedural", principle: "generalization",
      question: "You are writing about a finding from students in one university department. Which wording is most appropriate?",
      options: {
        A: "Describe the finding as applying to the students or setting that was actually studied unless broader evidence supports a wider claim.",
        B: "Generalize to all Nigerian students because they are all university students.",
        C: "Remove the name of the department and keep the broad claim.",
        D: "Ask the AI to make the claim sound more certain."
      }, correct: "A"
    },
    {
      id: "P6C", type: "conceptual", principle: "appropriate_reliance",
      question: "An AI-generated paragraph has a strong structure and accurate definitions but includes one unsupported factual claim. Which judgment is best?",
      options: {
        A: "Accept the whole paragraph because most of it is good.",
        B: "Different parts of the output can deserve different levels of reliance.",
        C: "Reject the whole paragraph because one part is uncertain.",
        D: "The unsupported claim becomes acceptable if the writing is clear."
      }, correct: "B"
    },
    {
      id: "P6P", type: "procedural", principle: "appropriate_reliance",
      question: "An AI tool creates a useful comparison table, but two cells contain information you cannot verify. What is the best response?",
      options: {
        A: "Use the entire table because most of the cells look correct.",
        B: "Delete the entire table without reviewing it.",
        C: "Ask the AI to add more detail to the two uncertain cells.",
        D: "Keep the verified parts and check or revise the uncertain cells before using the table."
      }, correct: "D"
    }
  ]
});
