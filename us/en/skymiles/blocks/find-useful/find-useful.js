function showAcknowledgeText() {
  // Replace question with acknowledge text
  const acknowledgeText = document.getElementById('acknowledge-text');
  const questionContainer = document.querySelector('.question-container');
  questionContainer.setAttribute('hidden', 'true');
  acknowledgeText.removeAttribute('hidden');
}

export default async function decorate(block) {
  let defaultQuestion = 'Did you find the information you were looking for on this page?';
  const currentFindUseful = block.querySelector('.find-useful > div > div');

  if (currentFindUseful) {
    defaultQuestion = currentFindUseful.textContent;
  }

  block.innerHTML = '';
  const divSectionFindUseful = document.createElement('div');

  const spanAckText = document.createElement('span');
  spanAckText.setAttribute('id', 'acknowledge-text');
  spanAckText.textContent = 'Thank you for your feedback.';
  spanAckText.setAttribute('hidden', 'true');

  const inputSurveyID = document.createElement('input');
  inputSurveyID.setAttribute('type', 'hidden');
  inputSurveyID.setAttribute('id', 'surveyID');
  inputSurveyID.setAttribute('name', 'surveyID');
  inputSurveyID.setAttribute('value', 'Y0LLcnRhFy9KjxsjyPybemlqYF1spmda');

  const divQuestionContainer = document.createElement('div');
  divQuestionContainer.classList.add('question-container');

  const spanAckQuestion = document.createElement('span');
  spanAckQuestion.classList.add('acknowledge-question');
  spanAckQuestion.textContent = defaultQuestion;

  const divFindUsefulButtonsContainer = document.createElement('div');
  divFindUsefulButtonsContainer.classList.add('find-useful-buttons-container');

  // Yes button
  const divYesButton = document.createElement('div');
  divYesButton.classList.add('find-useful-button');

  const yesButton = document.createElement('button');
  yesButton.setAttribute('id', 'yesBtn');
  yesButton.classList.add('button', 'primary');
  yesButton.setAttribute('type', 'button');
  yesButton.textContent = 'Yes';

  divYesButton.appendChild(yesButton);

  // No button
  const divNoButton = document.createElement('div');
  divNoButton.classList.add('find-useful-button');

  const noButton = document.createElement('button');
  noButton.setAttribute('id', 'noBtn');
  noButton.classList.add('button', 'primary');
  noButton.setAttribute('type', 'button');
  noButton.textContent = 'No';

  divNoButton.appendChild(noButton);

  divSectionFindUseful.appendChild(spanAckText);
  divSectionFindUseful.appendChild(inputSurveyID);
  divSectionFindUseful.appendChild(divQuestionContainer);
  divQuestionContainer.appendChild(spanAckQuestion);
  divQuestionContainer.appendChild(divFindUsefulButtonsContainer);
  divFindUsefulButtonsContainer.appendChild(divYesButton);
  divFindUsefulButtonsContainer.appendChild(divNoButton);

  block.innerHTML = divSectionFindUseful.innerHTML;

  // Add click event listener to 'Yes' button
  document.getElementById('yesBtn').addEventListener('click', (event) => {
    event.preventDefault();
    showAcknowledgeText();
  });

  // Add click event listener to 'No' button
  document.getElementById('noBtn').addEventListener('click', (event) => {
    event.preventDefault();
    showAcknowledgeText();
  });

  // Add section class to fix the div width
  const findUsefulWrapper = document.querySelector('.find-useful-wrapper');
  findUsefulWrapper.classList.add('section');
}
