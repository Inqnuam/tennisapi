function getPlayersAverageIMC(playerList = []) {
    const playersIMCs = playerList.map((x) => calculateIMC(x.data.weight, x.data.height));
    const sumIMC = getSum(playersIMCs);
    const averageIMC = (sumIMC / playersIMCs.length).toFixed(2);
    return Number(averageIMC);
}

function getMedianOf(arrayOfNumber = []) {
    const listCount = arrayOfNumber.length;
    if (!listCount) {
        return 0;
    }
    const list = arrayOfNumber.sort();
    const middle = Math.floor(listCount / 2);

    if (listCount % 2 === 0) {
        return (list[middle - 1] + list[middle]) / 2;
    }
    return list[middle];
}

function getBestCountry(playerList = []) {
    const vicByCountry = playerList
        .reduce((accum, player) => {
            const victories = getSum(player.data.last);
            const { code, picture } = player.country;
            const foundIndex = accum.findIndex((x) => x.code === code);

            if (foundIndex !== -1) {
                accum[foundIndex].victories += victories;
                accum[foundIndex].players += 1;
            } else {
                accum.push({ code, picture, victories, players: 1 });
            }

            return accum;
        }, [])
        .map((x) => {
            return { code: x.code, picture: x.picture, ratio: x.victories / x.players };
        })
        .sort((a, b) => b.ratio - a.ratio);

    if (vicByCountry.length > 0) return vicByCountry[0];
}

function getSum(list = []) {
    return list.reduce((accum, val) => {
        return (accum += val);
    }, 0);
}

function calculateIMC(weightGrammes, heightCM) {
    const kg = weightGrammes / 1000;
    const heightM = heightCM / 100;

    const imc = kg / Math.pow(heightM, 2);
    return isNaN(imc) ? 0 : imc;
}

function calculateAge(dob) {
    const diffMs = Date.now() - dob;
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export { calculateIMC, getSum, getBestCountry, getMedianOf, getPlayersAverageIMC, calculateAge };
