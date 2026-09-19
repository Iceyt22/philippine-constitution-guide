document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");

  const closeNavigation = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });
  }

  const articleSearch = document.querySelector("#article-search");
  const articleCards = [...document.querySelectorAll(".article-card")];
  const searchStatus = document.querySelector("#search-status");
  const noResults = document.querySelector("#no-results");

  if (articleSearch && searchStatus && noResults) {
    articleSearch.addEventListener("input", () => {
      const query = articleSearch.value.trim().toLowerCase();
      let count = 0;

      articleCards.forEach((card) => {
        const matches = card.textContent.toLowerCase().includes(query) || card.dataset.search.includes(query);
        card.hidden = !matches;
        if (matches) count += 1;
      });

      noResults.hidden = count !== 0;
      searchStatus.textContent = query
        ? `Showing ${count} of ${articleCards.length} articles for “${articleSearch.value.trim()}”.`
        : `Showing all ${articleCards.length} articles.`;
    });
  }

  const quiz = document.querySelector("#constitution-quiz");
  const quizFeedback = document.querySelector("#quiz-feedback");
  const answers = { q1: "b", q2: "c", q3: "a", q4: "c" };

  if (quiz && quizFeedback) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(quiz);
      const unanswered = Object.keys(answers).filter((question) => !formData.get(question));

      if (unanswered.length) {
        quizFeedback.textContent = `Please answer all ${Object.keys(answers).length} questions before checking your score.`;
        const firstUnanswered = quiz.querySelector(`input[name="${unanswered[0]}"]`);
        firstUnanswered?.focus();
        return;
      }

      const score = Object.entries(answers).reduce((total, [question, answer]) => {
        return total + (formData.get(question) === answer ? 1 : 0);
      }, 0);

      const message = score === 4
        ? "Excellent—4 out of 4 correct."
        : score >= 2
          ? `You scored ${score} out of 4. Review the guide and try again.`
          : `You scored ${score} out of 4. Revisit the article guide, then try again.`;

      quizFeedback.textContent = message;
    });

    quiz.addEventListener("reset", () => {
      window.setTimeout(() => {
        quizFeedback.textContent = "Quiz reset. Choose an answer for each question when you are ready.";
      }, 0);
    });
  }
});
