function findMonster() {
    combatTime = 0;
    all.char.attackSpeedCur = 0;
    all.enemy = createEnemy();
    console.log(all.enemy.huntCur);

    isCombat = true;
    isHunt = true;
    isFight = false;
    isConsume = false;
}

//Run every tick
function engageMonster() {
    if(!isCombat) {
        return;
    }
    combatTime += 1000 / ticksPerSecond;
    if(isHunt) {
        all.enemy.huntCur += 1000 / ticksPerSecond;
    }
    if(all.enemy.huntCur < all.enemy.huntMax && isHunt) {
        isHunt = false;
        all.logs.push({message:"Starting the fight!", timer:combatTime});
        return;
    }

    if(isFight) {
        processAttack("char", "enemy");
        processAttack("enemy", "char");
    }
    if(all.char.healthCur <= 0) { //died :(
        all.char.healthCur = all.char.healthCur < 0 ? 0 : all.char.healthCur;
        isCombat = false;
        all.logs.push({message:"You have died!", timer:combatTime});
        return;
    }
    if(all.enemy.healthCur <= 0) { //VICTORY
        all.enemy.healthCur = all.enemy.healthCur < 0 ? 0 : all.enemy.healthCur;
        isCombat = false;
        all.logs.push({message:"Enemy killed!", timer:combatTime});
        return;
    }


    if(isConsume) {
        all.enemy.consumeCur += 1000 / ticksPerSecond;
    }
    if(all.enemy.consumeCur < all.enemy.consumeMax && isConsume) {
        isConsume = false;
        getReward(all.char, all.enemy);
    }
}

function getReward(char, enemy) {
    for (let property in enemy.reward) {
        if (enemy.reward.hasOwnProperty(property)) {
            all.logs.push(view.create.log(enemy.reward[property], property, " gained for "));
            char[property] += enemy.reward[property];
        }
    }
}

function processAttack(attackerName, victimName) {
    let attacker = all[attackerName];
    let victim = all[victimName];

    attacker.attackSpeedCur += 1000 / ticksPerSecond;
    if(attacker.attackSpeedCur >= attacker.attackSpeedMax) { //attack!
        attacker.attackSpeedCur -= attacker.attackSpeedMax;
    } else { //not attacking yet
        return;
    }
    victim.healthCur -= attacker.attack;
    if(victim.healthCur < 0) {
        victim.healthCur = 0;
    }

    all.logs.push(view.create.damageLog(attacker.attack, victim.healthCur, "attack", victimName));
}



function recoverHealth() {
    processRecovery(all.char);
    if(all.enemy.healthCur > 0) {
        processRecovery(all.enemy);
    }
}

function processRecovery(creature) {
    creature.healthCur += creature.healthRegen;
    if(creature.healthCur > creature.healthMax) { creature.healthCur = creature.healthMax; }
}