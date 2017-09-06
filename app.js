const MONEY_DISPLAY = document.querySelector(".money");
const QUEST_CONTAINER = document.querySelector(".quest-container");
const LOG_DISPLAY = document.querySelector(".log");
const LEVEL_DISPLAY = document.querySelector(".level");
const LEVEL_PROGRESS_BAR = document.querySelector(".level-progress");

const QUESTS = [{
    name: "Small Quest",
    btnId: "small-quest-btn",
    minGoldLoot: 10,
    maxGoldLoot: 20,
    successRate: 0.5,
    expLoot: 5
  },
  {
    name: "Long Quest",
    btnId: "long-quest-btn",
    minGoldLoot: 30,
    maxGoldLoot: 50,
    successRate: 0.3,
    expLoot: 20
  },
  {
    name: "Boss Fight",
    btnId: "boss-fight-btn",
    minGoldLoot: 70,
    maxGoldLoot: 100,
    successRate: 0.1,
    expLoot: 100
  },
];

let money = 0;
let experience = 0;
let level = 1;

let logArr = [];

window.onload = () => {
  for (let quest of QUESTS) {
    QUEST_CONTAINER.appendChild(buildQuestBox(quest));
  }
  updateDisplay();
}


const completeQuest = (ev) => {
  let btnId = ev.target.id;
  for (let quest of QUESTS) {
    if (quest.btnId === btnId) {
      let loot = 0;
      let successRate = getSuccessRate(quest.successRate);
      if (successRate >= Math.random()) {
        loot = randInt(quest.minGoldLoot, quest.maxGoldLoot);
        money += loot;
        experience += quest.expLoot;
        log(`${quest.name} was a success! You won ${loot} gold and ${quest.expLoot} experience.`);
      } else {
        let expLoot = Math.ceil(quest.expLoot / 10);
        log(`${quest.name} failed. All you got was ${expLoot} experience.`);
        experience += expLoot;
      }
      updateDisplay();
      return;
    }
  }
}

const getSuccessRate = (base) => {
  return (1-((1-base)*Math.pow(0.9,level-1)));
}

const updateDisplay = () => {
  MONEY_DISPLAY.textContent = money.toLocaleString();
  updateLevelDisplay();
  updateQuestDisplay();
}

const updateQuestDisplay = () => {
  for (let questBox of QUEST_CONTAINER.childNodes) {
    // identify quest
    let questTitle = questBox.querySelector('h3').textContent;
    let quest = QUESTS.filter(q=>q.name===questTitle)[0];

    let newRate = Math.floor(getSuccessRate(quest.successRate) * 100);
    questBox.querySelector(".success-rate").textContent = newRate;
  }
}

const updateLevelDisplay = () => {
  let totalExp = expByLevel(level);
  while (experience >= totalExp) {
    level++;
    experience -= totalExp;
    totalExp = expByLevel(level);
  }
  LEVEL_DISPLAY.textContent = level;
  let progPercent = experience / totalExp * 100;
  LEVEL_PROGRESS_BAR.style.width = progPercent + '%';
}

const expByLevel = (level) => {
  return level * 100;
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
  earnings.textContent = `Earns ${quest.minGoldLoot}-${quest.maxGoldLoot} gold`;
  box.appendChild(earnings);

  let rateP = document.createElement("p");
  rateP.textContent = `% chance of success`;

  let rate = document.createElement("span");
  rate.classList.add("success-rate");
  rateP.prepend(rate);

  box.appendChild(rateP);

  let button = document.createElement("button");
  button.id = quest.btnId;
  button.textContent = "Take Quest";
  button.addEventListener("click", completeQuest);
  box.appendChild(button);

  return box;
}
