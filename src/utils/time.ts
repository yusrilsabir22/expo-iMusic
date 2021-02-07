export const dateSecToString = (sec: number) => {
    let minutes = Math.floor(sec / 60).toString()
    let seconds = Math.ceil(sec - (parseInt(minutes) * 60)).toString()
    if(parseInt(minutes) < 10) {minutes = "0"+minutes}
    if(parseInt(seconds) < 10) {seconds = "0"+seconds}

    return minutes + ":" + seconds
}

export const stringToNumber = (duration: string) => {
    // ex: 3.14 duration
    const splitDot = duration.split(':')
    // ex: 3 * 60 (minute)
    const minutes = parseInt(splitDot[0]) * 60
    const sec = Math.floor(parseInt(splitDot[1])).toString().replace('.', "")
    return Math.floor(minutes + parseInt(sec))
}

export const timeMilisToSec = (milis: number) => {
    return Math.floor(milis / 1000)
}