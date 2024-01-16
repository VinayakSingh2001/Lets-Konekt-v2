socket.on("availableOffers", (offers) => {
  console.log(offers);
  createOfferEls(offers);
});

socket.on("newOfferAwating", (offers) => {
  createOfferEls(offers);
});

function createOfferEls(offers) {
  //make green answer button for this new offer
  const answerEl = document.querySelector("#answer");
  offers.forEach((o) => {
    console.log(o);
    const newOfferEl = document.createElement("div");
    newOfferEl.innerHTML = `<button class="btn btn-success col-1">Answer ${o.offererUserName}</button>`;
    newOfferEl.addEventListener("click", () => answerOffer(o));
    answerEl.appendChild(newOfferEl);
  });
}
