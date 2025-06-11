import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

// Years you want to cover
const startDate = moment("2023-01-01");
const endDate = moment("2025-06-10");

const dates = [];

// Collect dates between 2023 and 2025 randomly
while (startDate.isSameOrBefore(endDate)) {
  const shouldCommitToday = random.boolean(); // 50% chance
  if (shouldCommitToday) {
    const commitsToday = random.int(1, 4); // 1 to 4 commits
    for (let i = 0; i < commitsToday; i++) {
      dates.push(startDate.clone());
    }
  }
  startDate.add(1, "day");
}

// Sort dates to commit in order
dates.sort((a, b) => a.toDate() - b.toDate());

const commitAtIndex = (index) => {
  if (index >= dates.length) {
    git.push();
    return;
  }

  const date = dates[index].toISOString();
  const data = { date };

  jsonfile.writeFile(path, data, () => {
    git.add([path])
      .commit(`Commit on ${date}`, { "--date": date })
      .then(() => commitAtIndex(index + 1));
  });
};

// Start committing
commitAtIndex(0);
