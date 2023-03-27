export default async function decorate(block) {
  block.innerHTML = '';
  const divSectionFeedback = document.createElement("div");

  const spanAckText = document.createElement("span");
  spanAckText.setAttribute("id", "acknowledgeText");
  spanAckText.textContent = "Thank you for your feedback.";
  spanAckText.setAttribute("hidden", "true");

  const inputSurveyID = document.createElement("input");
  inputSurveyID.setAttribute("type", "hidden");
  inputSurveyID.setAttribute("id", "surveyID");
  inputSurveyID.setAttribute("name", "surveyID");
  inputSurveyID.setAttribute("value", "Y0LLcnRhFy9KjxsjyPybemlqYF1spmda");

  const divQuestionContainer = document.createElement("div");
  divQuestionContainer.classList.add("question-container");

  const spanAckQuestion = document.createElement("span");
  spanAckQuestion.classList.add("acknowledge-question");
  spanAckQuestion.textContent = "Did you find the information you were looking for on this page?";

  const divFeedbackButtonsContainer = document.createElement("div");
  divFeedbackButtonsContainer.classList.add("feedback-buttons-container");

  // Yes button
  const divYesButton = document.createElement("div");
  divYesButton.classList.add("feedback-button");

  const yesButton = document.createElement("a");
  yesButton.setAttribute("id", "yesBtn");
  yesButton.classList.add("button", "primary");
  yesButton.setAttribute("href", "javascript:void(0)");
  yesButton.textContent = "Yes";
  
  divYesButton.appendChild(yesButton);

  // No button
  const divNoButton = document.createElement("div");
  divNoButton.classList.add("feedback-button");

  const noButton = document.createElement("a");
  noButton.setAttribute("id", "noBtn");
  noButton.classList.add("button", "primary");
  noButton.setAttribute("href", "javascript:void(0)");
  noButton.textContent = "No";
  
  divNoButton.appendChild(noButton);

  divSectionFeedback.appendChild(spanAckText);
  divSectionFeedback.appendChild(inputSurveyID);
  divSectionFeedback.appendChild(divQuestionContainer);
  divQuestionContainer.appendChild(spanAckQuestion);
  divQuestionContainer.appendChild(divFeedbackButtonsContainer);
  divFeedbackButtonsContainer.appendChild(divYesButton);
  divFeedbackButtonsContainer.appendChild(divNoButton);
  
  block.innerHTML = divSectionFeedback.innerHTML;

  // Add click event listener to "Yes" button
  document.getElementById("yesBtn").addEventListener("click", function() {
    showAcknowledgeText();
  });

  // Add click event listener to "No" button
  document.getElementById("noBtn").addEventListener("click", function() {
    showAcknowledgeText();
  });

  // Add section class to fix the div width
  const feedbackWrapper = document.querySelector(".feedback-wrapper");
  feedbackWrapper.classList.add("section");
}

function showAcknowledgeText() {
  // Replace question with acknowledge text
  var acknowledgeText = document.getElementById("acknowledgeText");
  var questionContainer = document.querySelector(".question-container");
  questionContainer.setAttribute("hidden", "true");
  acknowledgeText.removeAttribute("hidden");
}
