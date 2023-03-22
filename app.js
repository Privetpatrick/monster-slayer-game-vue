function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHP: 100,
      monsterHP: 100,
      round: 0,
      specialAttack: false,
      winner: null,
      logs: [],
    };
  },
  computed: {
    playerHPBar() {
      if (this.playerHP < 0) return { width: "0%" };
      return { width: this.playerHP + "%" };
    },
    monsterHPBar() {
      if (this.monsterHP < 0) return { width: "0%" };
      return { width: this.monsterHP + "%" };
    },
    gameOverMessage() {
      if (this.winner === "draw") return "It's a draw!";
      if (this.winner === "monster") return "You lost!";
      if (this.winner === "player") return "You won!";
    },
  },
  methods: {
    attackMonster() {
      this.round++;
      const damage = getRandomValue(5, 12);
      this.monsterHP -= damage;
      this.addLog("player", "attack", damage);
      this.attackPlayer();
    },
    attackPlayer() {
      const damage = getRandomValue(8, 15);
      this.playerHP -= damage;
      this.addLog("monster", "attack", damage);
    },
    specialAttackMonster() {
      this.specialAttack = false;
      const damage = getRandomValue(1, 20);
      this.monsterHP -= damage;
      this.addLog("player", "special-attack", damage);
      this.attackPlayer();
    },
    healPlayer() {
      const heal = getRandomValue(1, 20);
      if (this.playerHP + heal > 100) {
        this.playerHP = 100;
      } else {
        this.playerHP += heal;
      }
      this.addLog("player", "heal", heal);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    newGame() {
      this.winner = null;
      this.playerHP = 100;
      this.monsterHP = 100;
      this.round = 0;
      this.logs = [];
    },
    addLog(who, what, value) {
      this.logs.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
  watch: {
    round() {
      if (this.round === 3 && !this.specialAttack) {
        this.round = 0;
        this.specialAttack = true;
      }
      if (this.specialAttack) {
        this.round = 0;
      }
    },
    playerHP(value) {
      if (value <= 0 && this.monsterHP <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHP(value) {
      if (value <= 0 && this.playerHP <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
});

app.mount("#game");
