import yargs from "yargs/yargs"; //Yargs helps build interactive command line tools by parsing arguments and generating an elegant user interface.
import inquirer from "inquirer";

const withinGroup = (players) => {
  const fixtures = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      fixtures.push(`Player ${players[i]} vs Player ${players[j]}`);
    }
  }
  return fixtures;
};

const createFixtures = (numOfGroups, numOfPlayers) => {
  const allPlayers = Array(numOfPlayers).fill(0)
    .map((_value, index) => String.fromCharCode(index + 97));

  if (numOfGroups === 1) {
    return withinGroup(allPlayers);
  }

  const allGroups = Array(numOfGroups).fill(0)
    .map((_value, index) => ({
      group: String.fromCharCode(index + 65),
      players: [],
    }));

  for (let i = 0; i < numOfPlayers; i++) {
    allGroups[i % numOfGroups].players.push(allPlayers[i]);
  }

  const fixtures = [];

  for (let i = 0; i < numOfGroups; i++) {
    for (let j = i + 1; j < numOfGroups; j++) {
      for (let first = 0; first < allGroups[i].players.length; first++) {
        for (let second = 0; second < allGroups[j].players.length; second++) {
          fixtures.push(
            `Player ${allGroups[i].players[first]} v/s Player ${allGroups[j].players[second]}`
          );
        }
      }
    }
  }

  return fixtures;
};

const buildFixtures = async () => {
  const { numOfGroups } = await inquirer.prompt([
    {
      message: "Enter number of groups:",
      name: "numOfGroups",
      type: "number",
    },
  ]);

  const { numOfPlayers } = await inquirer.prompt([
    {
      message: "Enter number of players:",
      name: "numOfPlayers",
      type: "number",
    },
  ]);

  console.log(
    `The total groups are ${numOfGroups} and total players are ${numOfPlayers}`
  );

  if (numOfPlayers <= 0 || numOfGroups <= 0) {
    return console.log(
      "Number of players or number of groups must not be 0."
    );
  }

  if (numOfPlayers < numOfGroups) {
    return console.log("Number of players must be greater than number of groups");
  }

  console.log("The Fixtures are:");

  const fixtures = createFixtures(numOfGroups, numOfPlayers);

  console.log(fixtures.join("\n"));
};

yargs(process.argv.splice(2))
  .command("fixtures", "Used for creating fixtures.", () => {}, buildFixtures)
  .strict()
  .help("h").argv;
