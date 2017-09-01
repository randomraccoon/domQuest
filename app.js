const MONEY_DISPLAY = document.querySelector(".money");
const QUEST_CONTAINER = document.querySelector(".quest-container");
const LOG_DISPLAY = document.querySelector(".log");

const QUESTS = [{
    name: "Small Quest",
    btnid: "small-quest-btn",
    min: 10,
    max: 20,
    successRate: 0.5
  },
  {
    name: "Long Quest",
    btnid: "long-quest-btn",
    min: 10,
    max: 20,
    successRate: 0.3
  },
  {
    name: "Boss Fight",
    btnid: "boss-fight-btn",
    min: 10,
    max: 20,
    successRate: 0.1
  },
];

let money = 0;

let logArr = [];

window.onload = () => {
  for (let quest of QUESTS) {
    QUEST_CONTAINER.appendChild(buildQuestBox(quest));
  }
}


const incrementMoney = (ev) => {
  let btnId = ev.target.id;
  for (let btn of QUESTS) {
    if (btn.btnid === btnId) {
      let loot = 0;
      if (btn.successRate >= Math.random()) {
        loot = randInt(btn.min, btn.max);
        money += loot;
        MONEY_DISPLAY.textContent = money;
        log(btn.name + " was a success! You won " + loot + " gold.");
      } else {
        log(btn.name + " failed. You won nothing.");
      }


      return;
    }
  }
}

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const log = (msg) => {
  logArr.length = 4;
  logArr.unshift(msg);
  displayLog();
}

const displayLog = () => {
  while (LOG_DISPLAY.childNodes.length >= logArr.length) {
    LOG_DISPLAY.removeChild(LOG_DISPLAY.lastChild);
  }
  
  let line = document.createElement("p");
  line.textContent = logArr[0];
  LOG_DISPLAY.prepend(line);
};

const buildQuestBox = (quest) => {
  let box = document.createElement("div");
  box.classList.add("quest-box");

  let title = document.createElement("h3");
  title.textContent = quest.name;
  box.appendChild(title);

  let earnings = document.createElement("p");
  earnings.textContent = `Earns ${quest.min} to ${quest.max} gold.`;
  box.appendChild(earnings);

  let rate = document.createElement("p");
  rate.textContent = `${quest.successRate*100}% chance of success.`;
  box.appendChild(rate);

  let button = document.createElement("button");
  button.id = quest.btnid;
  button.textContent = "Take Quest";
  button.addEventListener("click", incrementMoney);
  box.appendChild(button);

  return box;
}
