function generatePin(count:number) {
    const min: number = 0;
    const max: number = 999999999;
    return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(count);
};

export default generatePin;