// Hamburger menu toggle
const toggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Tribute form submission
const tributeForm = document.getElementById("tributeForm");
const tributeList = document.getElementById("tributeList");

tributeForm.addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  const tributeItem = document.createElement("div");
  tributeItem.classList.add("tribute-item");
  tributeItem.innerHTML = `<h4>${name}</h4><p>${message}</p>`;

  tributeList.appendChild(tributeItem);

  tributeForm.reset();
});
