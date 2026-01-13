const accordions = document.querySelectorAll(".accordion");

accordions.forEach(acc => {
  acc.addEventListener("click", function() {
    const panel = this.nextElementSibling;
    panel.style.display = (panel.style.display === "block") ? "none" : "block";
    this.classList.toggle("active");
  });
});
